import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { Uploader } from "@0glabs/0g-ts-sdk";
import { HfInference } from "@huggingface/inference"; // The Eyes
import { sha256 } from 'js-sha256';
import fs from "fs/promises";
import path from "path";
import os from "os";

// --- CONFIGURATION ---
const PRIVATE_KEY = process.env.ZG_PRIVATE_KEY!;
const ZG_STORAGE_RPC = "https://rpc-storage-testnet.0g.ai";
const PROVIDER_ADDRESS = "0xf07240Efa67755B5311bc75784a061eDB47165Dd"; 
const HF_TOKEN = process.env.HF_TOKEN; // Get free token from huggingface.co/settings/tokens

export async function POST(req: Request) {
  let tmpFilePath = "";

  try {
    // 1. PARSE DATA
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bountyPrompt = formData.get("prompt") as string;
    
    if (!file) throw new Error("No file provided");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. "THE EYES": GENERATE CAPTION (Hugging Face BLIP)
    // We use a specialized Image-to-Text model to describe the content
    console.log("👀 Generating image caption...");
    const hf = new HfInference(HF_TOKEN);
    
    // Salesforce BLIP is excellent at describing images in plain English
    const captionResult = await hf.imageToText({
      data: new Blob([buffer]),
      model: 'Salesforce/blip-image-captioning-large',
    });

    const imageDescription = captionResult.generated_text;
    console.log(`📝 Image Description: "${imageDescription}"`);

    // 3. "THE BRAIN": 0G COMPUTE VERIFICATION
    // Now 0G has "text" it can understand to make a decision
    const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const broker = await createZGComputeNetworkBroker(wallet);
    
    try { await broker.inference.acknowledgeProviderSigner(PROVIDER_ADDRESS); } catch(e) {}
    const { endpoint, model } = await broker.inference.getServiceMetadata(PROVIDER_ADDRESS);

    const systemInstruction = `
    You are the Quality Control Judge for an AI Dataset.
    
    THE RULES (Bounty): "${bountyPrompt}"
    THE EVIDENCE (Image Content): "${imageDescription}"
    
    Your Job:
    1. Compare the Evidence against the Rules.
    2. If the image content contradicts the rules (e.g. Rule: "Cat", Evidence: "Dog"), REJECT.
    3. If the image content is vague but plausible, ACCEPT.
    4. Respond with JSON ONLY: { "valid": boolean, "reason": "string" }
    `;

    const headers = await broker.inference.getRequestHeaders(
        PROVIDER_ADDRESS, 
        JSON.stringify([{ role: "system", content: systemInstruction }])
    );
    
    const llmResponse = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ 
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: "Judge this submission." }
            ], 
            model 
        }),
    });

    const llmJson = await llmResponse.json();
    const rawVerdict = llmJson.choices[0].message.content;
    
    // Safe JSON Parsing
    let verdict = { valid: false, reason: "Parsing Error" };
    try {
        const jsonMatch = rawVerdict.match(/\{[\s\S]*\}/);
        if (jsonMatch) verdict = JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.error("LLM JSON Error:", rawVerdict);
    }

    if (!verdict.valid) {
        console.log(`❌ 0G Rejected: ${verdict.reason}`);
        return NextResponse.json(
            { success: false, message: `Compliance Check Failed: ${verdict.reason}` },
            { status: 400 }
        );
    }

    console.log(`✅ 0G Approved: ${verdict.reason}`);

    // 4. UPLOAD TO 0G STORAGE
    const contentHash = sha256(buffer);
    tmpFilePath = path.join(os.tmpdir(), `upload_${contentHash}`);
    await fs.writeFile(tmpFilePath, buffer);

    const uploader = new Uploader({
        rpcUrl: ZG_STORAGE_RPC,
        privateKey: PRIVATE_KEY,
    });

    const uploadResult = await uploader.upload(tmpFilePath);

    return NextResponse.json({
        success: true,
        rootHash: uploadResult.rootHash,
        message: `Verified: "${imageDescription}". Stored on 0G.`
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  } finally {
    if (tmpFilePath) await fs.unlink(tmpFilePath).catch(() => {});
  }
}
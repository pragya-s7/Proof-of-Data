import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from "ethers";
import 'dotenv/config';

async function test() {
    console.log("Testing 0G Compute/Inference...");
    console.log("=" + "=".repeat(59));

    try {
        const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
        const wallet = new ethers.Wallet(process.env.ZG_PRIVATE_KEY, provider);

        console.log("✓ Wallet created:", wallet.address);

        const broker = await createZGComputeNetworkBroker(wallet);
        console.log("✓ Broker created");

        const PROVIDER_ADDRESS = "0xf07240Efa67755B5311bc75784a061eDB47165Dd";

        // Try to acknowledge provider
        try {
            await broker.inference.acknowledgeProviderSigner(PROVIDER_ADDRESS);
            console.log("✓ Provider acknowledged");
        } catch(e) {
            console.log("⚠ Provider acknowledgment:", e.message);
        }

        // Get service metadata
        const { endpoint, model } = await broker.inference.getServiceMetadata(PROVIDER_ADDRESS);
        console.log("✓ Service metadata retrieved");
        console.log("  Endpoint:", endpoint);
        console.log("  Model:", model);

        // Test a simple inference
        const headers = await broker.inference.getRequestHeaders(
            PROVIDER_ADDRESS,
            JSON.stringify([{ role: "user", content: "Say 'test successful' and nothing else" }])
        );

        console.log("✓ Request headers generated");

        const response = await fetch(`${endpoint}/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({
                messages: [{ role: "user", content: "Say 'test successful' and nothing else" }],
                model
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const result = await response.json();
        console.log("✓ Inference successful!");
        console.log("  Response:", result.choices[0].message.content);

        console.log("\n" + "=" + "=".repeat(59));
        console.log("0G Compute: WORKING ✓");
        console.log("=" + "=".repeat(59));

    } catch(error) {
        console.error("\n✗ Error:", error.message);
        console.log("\n" + "=" + "=".repeat(59));
        console.log("0G Compute: FAILED ✗");
        console.log("=" + "=".repeat(59));
        process.exit(1);
    }
}

test();

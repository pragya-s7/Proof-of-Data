import { Uploader } from "@0glabs/0g-ts-sdk";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import 'dotenv/config';

async function test() {
    console.log("Testing 0G Storage...");
    console.log("=" + "=".repeat(59));

    try {
        // Create a test image file (small PNG)
        const testData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
        const tmpFile = path.join(os.tmpdir(), 'detrain-test.png');
        await fs.writeFile(tmpFile, testData);

        console.log("✓ Test file created:", tmpFile);

        const uploader = new Uploader({
            rpcUrl: "https://rpc-storage-testnet.0g.ai",
            privateKey: process.env.ZG_PRIVATE_KEY,
        });

        console.log("✓ Uploader initialized");
        console.log("  Methods available:", Object.getOwnPropertyNames(Object.getPrototypeOf(uploader)));

        // Try uploadFile method
        const uploadResult = await uploader.uploadFile(tmpFile);

        console.log("✓ Upload successful!");
        console.log("  Root Hash:", uploadResult.rootHash);

        // Clean up
        await fs.unlink(tmpFile);

        console.log("\n" + "=" + "=".repeat(59));
        console.log("0G Storage: WORKING ✓");
        console.log("Root Hash:", uploadResult.rootHash);
        console.log("=" + "=".repeat(59));

    } catch(error) {
        console.error("\n✗ Error:", error);
        console.log("\n" + "=" + "=".repeat(59));
        console.log("0G Storage: FAILED ✗");
        console.log("=" + "=".repeat(59));
        process.exit(1);
    }
}

test();

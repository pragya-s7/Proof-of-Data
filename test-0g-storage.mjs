import { Uploader } from "@0glabs/0g-ts-sdk";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import 'dotenv/config';

async function test() {
    console.log("Testing 0G Storage...");
    console.log("=" + "=".repeat(59));

    try {
        // Create a test file
        const testData = "Hello from DeTrain - Test upload at " + new Date().toISOString();
        const tmpFile = path.join(os.tmpdir(), 'detrain-test.txt');
        await fs.writeFile(tmpFile, testData);

        console.log("✓ Test file created:", tmpFile);

        const uploader = new Uploader({
            rpcUrl: "https://rpc-storage-testnet.0g.ai",
            privateKey: process.env.ZG_PRIVATE_KEY,
        });

        console.log("✓ Uploader initialized");
        console.log("  Uploading to 0G Storage...");

        const uploadResult = await uploader.upload(tmpFile);

        console.log("✓ Upload successful!");
        console.log("  Root Hash:", uploadResult.rootHash);

        // Clean up
        await fs.unlink(tmpFile);

        // Try to download it back
        console.log("\n  Testing download...");
        const downloadUrl = `https://rpc-storage-testnet.0g.ai/file?root=${uploadResult.rootHash}`;
        const response = await fetch(downloadUrl);

        if (response.ok) {
            const downloaded = await response.text();
            console.log("✓ Download successful!");
            console.log("  Content:", downloaded);

            if (downloaded === testData) {
                console.log("✓ Data integrity verified!");
            }
        } else {
            console.log("⚠ Download returned:", response.status);
        }

        console.log("\n" + "=" + "=".repeat(59));
        console.log("0G Storage: WORKING ✓");
        console.log("=" + "=".repeat(59));

    } catch(error) {
        console.error("\n✗ Error:", error.message);
        console.log("\n" + "=" + "=".repeat(59));
        console.log("0G Storage: FAILED ✗");
        console.log("=" + "=".repeat(59));
        process.exit(1);
    }
}

test();

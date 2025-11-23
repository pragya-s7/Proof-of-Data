import { promises as fs } from 'fs';

async function testUpload() {
    console.log("Testing upload API...\n");

    try {
        // Read test file
        const fileContent = await fs.readFile('public/test-digit.txt');

        // Create form data
        const formData = new FormData();
        const blob = new Blob([fileContent], { type: 'text/plain' });
        formData.append('file', blob, 'test-digit.txt');
        formData.append('prompt', 'Handwritten Digit Recognition');

        console.log("Sending upload request...");

        const response = await fetch('http://localhost:3000/api/agent/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        console.log("\n" + "=".repeat(60));
        console.log("UPLOAD RESULT:");
        console.log("=".repeat(60));
        console.log("Status:", response.status);
        console.log("Success:", result.success);
        console.log("Message:", result.message);
        if (result.rootHash) {
            console.log("Root Hash:", result.rootHash);
        }
        if (result.caption) {
            console.log("Caption:", result.caption);
        }
        if (result.verdict) {
            console.log("Verdict:", result.verdict);
        }
        console.log("=".repeat(60));

        if (result.success) {
            console.log("\n✅ TEST PASSED - Upload successful!");
            console.log("✓ 0G Compute verified the data");
            console.log("✓ 0G Storage uploaded the file");
            console.log("✓ Ready for ROFL agent to process");
        } else {
            console.log("\n❌ TEST FAILED:", result.message);
        }

    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        process.exit(1);
    }
}

testUpload();

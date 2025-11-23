import { promises as fs } from 'fs';

async function test() {
    console.log("Testing snacks.png upload...\n");

    const fileContent = await fs.readFile('public/snacks.png');
    const formData = new FormData();
    const blob = new Blob([fileContent], { type: 'image/png' });
    formData.append('file', blob, 'snacks.png');
    formData.append('prompt', 'Images of snacks for robot training - chips, candy, drinks, or similar food items');

    console.log("Uploading snacks.png...");
    const response = await fetch('http://localhost:3000/api/agent/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    console.log("\nResult:", result);

    if (result.success) {
        console.log("\n✅ SUCCESS - snacks.png uploaded!");
        console.log("Root Hash:", result.rootHash);
    } else {
        console.log("\n❌ FAILED:", result.message);
    }
}

test().catch(console.error);

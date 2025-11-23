import { promises as fs } from 'fs';

async function test() {
    console.log("Testing outdoors.png (should be REJECTED)...\n");

    const fileContent = await fs.readFile('public/outdoors.png');
    const formData = new FormData();
    const blob = new Blob([fileContent], { type: 'image/png' });
    formData.append('file', blob, 'outdoors.png');
    formData.append('prompt', 'Images of snacks for robot training - chips, candy, drinks, or similar food items');

    console.log("Uploading outdoors.png...");
    const response = await fetch('http://localhost:3000/api/agent/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    console.log("\nResult:", result);

    if (!result.success) {
        console.log("\n✅ CORRECTLY REJECTED!");
        console.log("Reason:", result.message);
    } else {
        console.log("\n❌ ERROR: Should have been rejected!");
    }
}

test().catch(console.error);

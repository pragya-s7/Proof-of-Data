#!/usr/bin/env python3
"""Test 0G Compute/Inference"""

import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def test_0g_compute():
    print("Testing 0G Compute/Inference...")
    print("=" * 60)

    # Import the broker
    try:
        import sys
        sys.path.insert(0, '.')

        # We'll use Node.js to test since the SDK is TypeScript
        import subprocess

        test_code = """
        const { createZGComputeNetworkBroker } = require("@0glabs/0g-serving-broker");
        const { ethers } = require("ethers");

        async function test() {
            try {
                const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
                const wallet = new ethers.Wallet(process.env.ZG_PRIVATE_KEY, provider);
                const broker = await createZGComputeNetworkBroker(wallet);

                const PROVIDER_ADDRESS = "0xf07240Efa67755B5311bc75784a061eDB47165Dd";

                console.log("✓ Broker created");

                // Try to acknowledge provider
                try {
                    await broker.inference.acknowledgeProviderSigner(PROVIDER_ADDRESS);
                    console.log("✓ Provider acknowledged");
                } catch(e) {
                    console.log("⚠ Provider acknowledgment failed (may be OK):", e.message);
                }

                // Get service metadata
                const { endpoint, model } = await broker.inference.getServiceMetadata(PROVIDER_ADDRESS);
                console.log("✓ Service metadata retrieved");
                console.log("  Endpoint:", endpoint);
                console.log("  Model:", model);

                // Test a simple inference
                const headers = await broker.inference.getRequestHeaders(
                    PROVIDER_ADDRESS,
                    JSON.stringify([{ role: "user", content: "Say 'test successful'" }])
                );

                console.log("✓ Request headers generated");

                const response = await fetch(`${endpoint}/chat/completions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...headers },
                    body: JSON.stringify({
                        messages: [{ role: "user", content: "Say 'test successful'" }],
                        model
                    })
                });

                const result = await response.json();
                console.log("✓ Inference successful!");
                console.log("  Response:", result.choices[0].message.content);

            } catch(error) {
                console.error("✗ Error:", error.message);
                process.exit(1);
            }
        }

        test();
        """

        # Write test to temp file
        with open('/tmp/test_0g.js', 'w') as f:
            f.write(test_code)

        # Run with node
        result = subprocess.run(
            ['node', '/tmp/test_0g.js'],
            capture_output=True,
            text=True,
            timeout=30
        )

        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)

        if result.returncode == 0:
            print("\n" + "=" * 60)
            print("0G Compute: WORKING ✓")
            print("=" * 60)
            return True
        else:
            print("\n" + "=" * 60)
            print("0G Compute: FAILED ✗")
            print("=" * 60)
            return False

    except Exception as e:
        print(f"✗ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_0g_compute())
    exit(0 if success else 1)

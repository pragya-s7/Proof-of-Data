import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from "ethers";
import 'dotenv/config';

async function setup() {
    console.log("Setting up 0G Compute account...\n");

    const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
    const wallet = new ethers.Wallet(process.env.ZG_PRIVATE_KEY, provider);
    const broker = await createZGComputeNetworkBroker(wallet);

    console.log("Wallet:", wallet.address);

    // Check if account exists
    let accountExists = true;
    try {
        const account = await broker.ledger.getLedger();
        const currentBalance = ethers.formatEther(account.totalBalance);
        console.log(`Current balance: ${currentBalance} 0G`);

        if (parseFloat(currentBalance) >= 1) {
            console.log("✅ Account already funded");
            return;
        }
    } catch (e) {
        if (e.message.includes('LedgerNotExists') || e.reason?.includes('LedgerNotExists')) {
            console.log("Account doesn't exist yet, creating...");
            accountExists = false;
        } else {
            throw e;
        }
    }

    // Add ledger (creates account if doesn't exist)
    // Use 5 tokens to leave room for gas
    console.log("\nAdding 5 0G tokens to account (leaving 5 for gas)...");
    const tx = await broker.ledger.addLedger(5);
    console.log("Transaction:", tx.hash);
    console.log("✅ Account created and funded with 5 0G tokens");

    // Verify
    const newAccount = await broker.ledger.getLedger();
    console.log(`\nFinal balance: ${ethers.formatEther(newAccount.totalBalance)} 0G`);

    console.log("\n✅ 0G Compute account ready!");
}

setup().catch(console.error);

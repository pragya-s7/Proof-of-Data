import { ethers } from "ethers";
import 'dotenv/config';

async function checkBalance() {
    const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
    const wallet = new ethers.Wallet(process.env.ZG_PRIVATE_KEY, provider);

    const balance = await provider.getBalance(wallet.address);

    console.log("Wallet:", wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "0G");
    console.log("Balance (wei):", balance.toString());
}

checkBalance();

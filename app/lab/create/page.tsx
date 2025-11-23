"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDeTrainContract } from '@/lib/useDeTrainContract'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { ethers } from 'ethers'
import deployedAddresses from '@/backend/deployed-addresses.json';
import MockUSDC_ABI from '@/backend/artifacts/contracts/MockUSDC.sol/MockUSDC.json';

const MOCK_USDC_ADDRESS = deployedAddresses.MockUSDC;

export default function CreateBounty() {
  const detrainContract = useDeTrainContract();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    setMinting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, MockUSDC_ABI.abi, signer);

      toast.info("Minting 1000 MockUSDC...");
      const tx = await usdcContract.mint(address, ethers.parseUnits("1000", 6));
      await tx.wait();
      toast.success("Successfully minted 1000 MockUSDC!");
    } catch (err) {
      toast.error(err.message || "Failed to mint tokens");
      console.error('Mint error', err);
    } finally {
      setMinting(false);
    }
  }

  const handleFund = async (event) => {
    event.preventDefault();
    if (!isConnected) {
      toast.error('Connect your wallet!');
      return;
    }
    setLoading(true);
    const amount = event.target.amount.value;
    const baseReward = event.target.baseReward.value;
    const bonusMultiplier = event.target.bonusMultiplier.value;

    try {
      if (!detrainContract) throw new Error("No contract available");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = detrainContract.connect(signer);

      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, MockUSDC_ABI.abi, signer);

      const balance = await usdcContract.balanceOf(await signer.getAddress());
      console.log("MockUSDC balance:", ethers.formatUnits(balance, 6));
      
      toast.info('1/4: Approving tokens...');
      const approveTx = await usdcContract.approve(await contractWithSigner.getAddress(), ethers.parseUnits(amount, 6));
      console.log("Approve transaction hash:", approveTx.hash);
      await approveTx.wait();
      toast.success('1/4: Tokens approved!');

      const allowance = await usdcContract.allowance(await signer.getAddress(), await contractWithSigner.getAddress());
      console.log("Allowance:", ethers.formatUnits(allowance, 6));

      toast.info('2/4: Funding reward pool...');
      const tx = await contractWithSigner.fundRewardPool(ethers.parseUnits(amount, 6), { value: 0 });
      console.log("Fund pool transaction hash:", tx.hash);
      await tx.wait();
      toast.success('2/4: Reward pool funded!');

      toast.info('3/4: Setting base reward...');
      const tx2 = await contractWithSigner.setBaseReward(ethers.parseUnits(baseReward, 6));
      console.log("Set base reward transaction hash:", tx2.hash);
      await tx2.wait();
      toast.success('3/4: Base reward set!');

      toast.info('4/4: Setting bonus multiplier...');
      const tx3 = await contractWithSigner.setBonusMultiplier(bonusMultiplier);
      console.log("Set bonus multiplier transaction hash:", tx3.hash);
      await tx3.wait();
      toast.success('4/4: Bonus multiplier set!');

    } catch (err) {
      toast.error(err.message || 'Failed to fund bounty');
      console.error('Fund error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Fund Bounty</h1>

      <Card className="bg-zinc-900/50 border-white/10 mb-8">
        <CardHeader>
          <CardTitle>Mint MockUSDC</CardTitle>
          <CardDescription>Mint some MockUSDC tokens to your account for testing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleMint} disabled={minting || !isConnected}>
            {minting ? 'Minting...' : 'Mint 1000 mUSDC'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle>Bounty Details</CardTitle>
          <CardDescription>Fund the reward pool and set the reward parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleFund} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Funding Amount (USDC)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0.01" placeholder="100" className="bg-zinc-950 border-white/10" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseReward">Base Reward (USDC)</Label>
                <Input id="baseReward" name="baseReward" type="number" step="0.01" min="0.01" placeholder="1" className="bg-zinc-950 border-white/10" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonusMultiplier">Bonus Multiplier</Label>
                <Input id="bonusMultiplier" name="bonusMultiplier" type="number" step="1" min="1" placeholder="100" className="bg-zinc-950 border-white/10" required />
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Funding...' : 'Fund Pool'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

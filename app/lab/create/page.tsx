"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDeTrainContract } from '@/lib/useDeTrainContract'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import { ethers } from 'ethers'

export default function CreateBounty() {
  const detrainContract = useDeTrainContract();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);

  const handleDeploy = async (event) => {
    event.preventDefault();
    if (!isConnected) {
      toast.error('Connect your wallet!');
      return;
    }
    setLoading(true);
    const title = event.target.title.value;
    const description = event.target.description.value;
    const reward = event.target.reward.value;
    const budget = event.target.budget.value;
    // Parse as ETH (decimal string, e.g., '0.01')
    let rewardWei, maxSubmissions, valueWei;
    try {
      rewardWei = ethers.parseEther(reward);
      maxSubmissions = Math.floor(parseFloat(budget) / parseFloat(reward));
      valueWei = rewardWei * BigInt(maxSubmissions);
    } catch {
      toast.error('Please enter valid OG values for reward and budget');
      setLoading(false);
      return;
    }
    // Safety check for accidental whales
    if (parseFloat(reward) > 10 || parseFloat(budget) > 100) {
      toast.error('Reward or budget too large (over 10 or 100 OG). Are your units correct?');
      setLoading(false);
      return;
    }
    const metadataURI = "ipfs://test-metadata";
    try {
      if (!detrainContract) throw new Error("No contract available");
      // Get signer & connect contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = detrainContract.connect(signer);
      toast('Deploying...');
      const tx = await contractWithSigner.createBounty(
        description,
        metadataURI,
        rewardWei,
        maxSubmissions,
        { value: valueWei }
      );
      toast('Transaction submitted: ' + (tx?.hash || '(no hash)'));
      // Fully defensive .wait() usage
      if (tx && typeof tx.wait === 'function') {
        try {
          await tx.wait();
          toast.success('Bounty contract deployed!');
        } catch (waitErr) {
          toast('Transaction sent! Could not auto-confirm, check Etherscan.');
        }
      } else {
        toast('Transaction sent! Please check Etherscan for confirmation.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to deploy bounty');
      console.error('Deploy error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Data Bounty</h1>
      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle>Bounty Details</CardTitle>
          <CardDescription>Define the data you need and the rewards for contributors (in OG).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleDeploy} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Bounty Title</Label>
              <Input id="title" name="title" placeholder="e.g. Diverse Face Dataset for Emotion Recognition" className="bg-zinc-950 border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description & Requirements</Label>
              <Textarea id="description" name="description" placeholder="Describe exactly what data you are looking for..." className="min-h-[150px] bg-zinc-950 border-white/10" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward">Base Reward (OG)</Label>
                <Input id="reward" name="reward" type="number" step="0.0001" min="0.00001" placeholder="0.05" className="bg-zinc-950 border-white/10" required />
                <span className="text-xs text-muted-foreground">Reward for each contribution, in OG (e.g. 0.01)</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Total Budget (OG)</Label>
                <Input id="budget" name="budget" type="number" step="0.0001" min="0.00001" placeholder="1.5" className="bg-zinc-950 border-white/10" required />
                <span className="text-xs text-muted-foreground">Max OG to spend, in OG (e.g. 1.0)</span>
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Deploying...' : 'Deploy Bounty Smart Contract'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

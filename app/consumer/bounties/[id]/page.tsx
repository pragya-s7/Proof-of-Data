"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, CheckCircle2, Wallet, ChevronLeft, FileText, Database } from "lucide-react"
import { toast } from "sonner"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"

// ABI Segment for submitData
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "string","name": "dataHash","type": "string"}],
    "name": "submitData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function BountyDetail() {
  // ... hook logic ...
  const { isConnected } = useAccount()
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "tx_pending" | "success" | "error">("idle")
  const [zeroGHash, setZeroGHash] = useState<string>("")
  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash }) 

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get("dataset") as File
    const prompt = "Handwritten Digit Recognition" 

    if (!file) return;
    setUploadState("uploading")

    try {
      const textData = await file.text(); 
      const response = await fetch("/api/agent/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: textData, prompt: prompt, dataType: "text" })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      setZeroGHash(result.rootHash);
      setUploadState("tx_pending");
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitData',
        args: [result.rootHash],
      });
    } catch (err: any) {
        console.error(err);
        setUploadState("error");
        toast.error(err.message || "Upload failed");
    }
  }

  if (isConfirmed && uploadState !== "success") {
    setUploadState("success");
    toast.success("Submission confirmed on Oasis Network!");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-16 z-30">
        <div className="container h-16 flex items-center justify-between">
             <Link href="/consumer/bounties" className="text-sm font-medium text-zinc-400 hover:text-white flex items-center transition-colors">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Marketplace
            </Link>
            <ConnectButton />
        </div>
      </div>

      <div className="container py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Bounty Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-md border border-purple-500/20">Computer Vision</Badge>
                    <Badge variant="outline" className="text-zinc-400 border-white/10">MNIST</Badge>
                </div>
                <h1 className="text-4xl font-medium tracking-tight mb-4 text-white">Handwritten Digit Recognition</h1>
                <p className="text-lg text-zinc-400 leading-relaxed">
                    OpenAI Research is seeking high-quality images of handwritten digits (0-9) to improve the robustness of their OCR models against noisy backgrounds.
                </p>
            </div>

            <Tabs defaultValue="requirements" className="w-full">
                <TabsList className="w-full justify-start border-b border-white/10 rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="requirements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-500 data-[state=active]:bg-transparent px-6 py-3 text-zinc-400 hover:text-zinc-200">Requirements</TabsTrigger>
                    <TabsTrigger value="examples" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-500 data-[state=active]:bg-transparent px-6 py-3 text-zinc-400 hover:text-zinc-200">Examples</TabsTrigger>
                    <TabsTrigger value="rewards" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-500 data-[state=active]:bg-transparent px-6 py-3 text-zinc-400 hover:text-zinc-200">Rewards</TabsTrigger>
                </TabsList>
                <TabsContent value="requirements" className="pt-6 space-y-4">
                    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="font-medium flex items-center gap-2 text-white"><FileText className="h-4 w-4 text-purple-400"/> Data Format</h3>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-2">
                            <li>Format: CSV or Grayscale Image Folder</li>
                            <li>Resolution: 28x28 pixels minimum</li>
                            <li>Labeling: Must include ground truth labels (0-9)</li>
                        </ul>
                    </div>
                </TabsContent>
                <TabsContent value="examples" className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="aspect-square bg-zinc-900 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500">Example 1</div>
                        <div className="aspect-square bg-zinc-900 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500">Example 2</div>
                        <div className="aspect-square bg-zinc-900 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500">Example 3</div>
                    </div>
                </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column: Action Card */}
          <div className="lg:col-span-1">
            <Card className="border border-purple-500/20 bg-zinc-900/80 shadow-lg shadow-purple-900/10 sticky top-32 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-400 w-full"></div>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <Database className="h-5 w-5 text-purple-400" />
                    Submit Contribution
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Earn <span className="font-bold text-white">500 USDC</span> per verified batch.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {!isConnected ? (
                    <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/10">
                        <p className="mb-4 text-zinc-400 text-sm">Connect your wallet to verify & submit data.</p>
                        <div className="flex justify-center scale-90"><ConnectButton /></div>
                    </div>
                ) : (
                    <>
                    {uploadState === "idle" && (
                        <form onSubmit={handleFileUpload} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="dataset" className="text-sm font-medium text-zinc-300">Upload Dataset</Label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors text-center cursor-pointer relative group">
                                <Input id="dataset" name="dataset" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                <UploadCloud className="h-8 w-8 text-zinc-500 group-hover:text-purple-400 transition-colors mx-auto mb-2" />
                                <p className="text-sm text-purple-400 font-medium">Click to upload</p>
                                <p className="text-xs text-zinc-500">CSV, TXT, or ZIP</p>
                            </div>
                        </div>
                        <Button type="submit" className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 h-12 text-base shadow-lg shadow-purple-900/20 text-white">
                            Verify & Submit
                        </Button>
                        </form>
                    )}

                    {uploadState === "uploading" && (
                        <div className="text-center py-8 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-800 border-t-purple-500 mx-auto"></div>
                            <p className="text-zinc-400 text-sm font-medium animate-pulse">Verifying on 0G Compute...</p>
                        </div>
                    )}

                    {uploadState === "tx_pending" && (
                        <div className="text-center py-8 space-y-4">
                            <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center animate-pulse">
                                <Wallet className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Confirm Transaction</p>
                                <p className="text-xs text-zinc-500 mt-1">Please sign in your wallet.</p>
                            </div>
                            {isPending && <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Waiting for signature...</Badge>}
                            {isConfirming && <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Confirming on Oasis...</Badge>}
                        </div>
                    )}

                    {uploadState === "success" && (
                        <div className="text-center py-8 space-y-4">
                        <div className="rounded-full h-16 w-16 bg-green-500/10 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Success!</h3>
                            <p className="text-zinc-500 text-xs mt-2 font-mono bg-black/30 py-1 px-2 rounded mx-auto w-fit">{zeroGHash.substring(0,10)}...</p>
                            <p className="text-green-500 mt-2 text-sm font-medium">Data verified & stored.</p>
                        </div>
                        <Button onClick={() => setUploadState("idle")} variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 text-white">
                            Submit Another Batch
                        </Button>
                        </div>
                    )}
                    </>
                )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
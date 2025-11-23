"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, CheckCircle2, Wallet, ChevronLeft, FileText, Database, XCircle } from "lucide-react"
import { toast } from "sonner"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useWriteContract, useWatchContractEvent } from "wagmi"
import { useDeTrainContract } from "@/lib/useDeTrainContract";
import { formatUnits } from "ethers"

export default function BountyDetail() {
  const { address, isConnected } = useAccount()
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "tx_pending" | "evaluating" | "evaluated" | "success" | "error">("idle")
  const [zeroGHash, setZeroGHash] = useState<string>("")
  const [submissionId, setSubmissionId] = useState<bigint | null>(null)
  const [evaluationResult, setEvaluationResult] = useState<{ accuracyDelta: bigint, payout: bigint } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { writeContractAsync } = useWriteContract()
  const detrainContract = useDeTrainContract();

  useWatchContractEvent({
    address: detrainContract?.address as `0x${string}`,
    abi: detrainContract?.abi,
    eventName: 'EvaluationReported',
    onLogs(logs) {
      const log = logs.find(l => l.args.submissionId === submissionId);
      if (log) {
        setEvaluationResult({
          accuracyDelta: log.args.accuracyDelta,
          payout: log.args.payout,
        });
        setUploadState("evaluated");
        if (log.args.payout > 0) {
          toast.success(`Evaluation complete! You earned ${formatUnits(log.args.payout, 6)} USDC.`);
        } else {
          toast.info("Evaluation complete. No reward for this submission.");
        }
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const prompt = "Images of snacks for robot training - chips, candy, drinks, or similar food items" 

    setUploadState("uploading")

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("prompt", prompt);
      const response = await fetch("/api/agent/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      // Just use the rootHash - ROFL agent will evaluate uniqueness
      setZeroGHash(result.rootHash);
      setUploadState("tx_pending");

      const txHash = await writeContractAsync({
        address: detrainContract.address as `0x${string}`,
        abi: detrainContract.abi,
        functionName: 'submitData',
        args: [result.rootHash],
      });

      const submissionId = await detrainContract.read.nextSubmissionId() - 1n;
      setSubmissionId(submissionId);
      
      setUploadState("evaluating");
      toast.info("Submission sent to contract. Awaiting evaluation...");

    } catch (err: any) {
        console.error(err);
        setUploadState("error");
        toast.error(err.message || "Upload failed");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      

      <div className="container py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Bounty Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-md border border-purple-500/20">Computer Vision</Badge>
                    <Badge variant="outline" className="text-zinc-400 border-white/10">Robotics</Badge>
                </div>
                <h1 className="text-4xl font-medium tracking-tight mb-4 text-white">Snack Distribution Robot Training</h1>
                <p className="text-lg text-zinc-400 leading-relaxed">
                    Anthropic Robotics is building a snack distribution robot for hackathons. We need diverse images of snacks (chips, candy, drinks, etc.) to train our vision system to recognize and pick up different snack types.
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
                            <li>Format: JPG, PNG, or other image formats</li>
                            <li>Resolution: 512x512 pixels minimum</li>
                            <li>Content: Clear images of snacks (chips, candy, drinks, etc.)</li>
                            <li>Quality: Well-lit, focused, minimal background clutter</li>
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
                            <Label htmlFor="dataset" className="text-sm font-medium text-zinc-300">Upload Snack Image</Label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors text-center cursor-pointer relative group">
                                <Input id="dataset" name="dataset" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} required />
                                {selectedFile ? (
                                  <div>
                                    <p className="text-sm text-purple-400 font-medium">{selectedFile.name}</p>
                                    <p className="text-xs text-zinc-500">{Math.round(selectedFile.size / 1024)} KB</p>
                                  </div>
                                ) : (
                                  <>
                                    <UploadCloud className="h-8 w-8 text-zinc-500 group-hover:text-purple-400 transition-colors mx-auto mb-2" />
                                    <p className="text-sm text-purple-400 font-medium">Click to upload</p>
                                    <p className="text-xs text-zinc-500">PNG, JPG, or JPEG</p>
                                  </>
                                )}
                            </div>
                        </div>
                        <Button type="submit" className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 h-12 text-base shadow-lg shadow-purple-900/20 text-white">
                            Upload & Verify
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
                                <p className="text-white font-medium">Confirming Transaction</p>
                                <p className="text-xs text-zinc-500 mt-1">Please sign in your wallet.</p>
                            </div>
                        </div>
                    )}

                    {uploadState === "evaluating" && (
                        <div className="text-center py-8 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-800 border-t-blue-500 mx-auto"></div>
                            <p className="text-zinc-400 text-sm font-medium animate-pulse">Awaiting evaluation from the agent...</p>
                        </div>
                    )}

                    {uploadState === "evaluated" && evaluationResult && (
                        <div className="text-center py-8 space-y-4">
                        <div className={`rounded-full h-16 w-16 ${evaluationResult.payout > 0 ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center mx-auto`}>
                            {evaluationResult.payout > 0 ? <CheckCircle2 className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-500" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Evaluation Complete</h3>
                            <p className="text-zinc-500 text-xs mt-2 font-mono bg-black/30 py-1 px-2 rounded mx-auto w-fit">{zeroGHash.substring(0,10)}...</p>
                            <p className={`${evaluationResult.payout > 0 ? 'text-green-500' : 'text-red-500'} mt-2 text-sm font-medium`}>
                              {evaluationResult.payout > 0 ? `You earned ${formatUnits(evaluationResult.payout, 6)} USDC!` : 'Submission did not meet quality standards.'}
                            </p>
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
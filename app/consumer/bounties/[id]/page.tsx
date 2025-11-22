"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UploadCloud, CheckCircle2, AlertCircle, BrainCircuit } from "lucide-react"
import { toast } from "sonner"

export default function BountyDetail() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "verifying" | "success" | "error">("idle")
  const [impactScore, setImpactScore] = useState<number | null>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadState("uploading")

    // Simulate upload
    setTimeout(() => {
      setUploadState("verifying")
      // Simulate verification
      setTimeout(() => {
        const success = Math.random() > 0.3 // 70% chance of success for demo
        if (success) {
          setImpactScore(0.85)
          setUploadState("success")
          toast.success("Data verified! Impact score: +0.85%")
        } else {
          setUploadState("error")
          toast.error("Data rejected. Did not improve model accuracy.")
        }
      }, 3000)
    }, 2000)
  }

  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-8">
        <Link href="/consumer/bounties" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← Back to Bounties
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Handwritten Digit Recognition Dataset</h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-primary border-primary/20">
                OpenAI Research
              </Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Easy
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">500 USDC</div>
            <div className="text-sm text-muted-foreground">Per valid submission</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 space-y-4">
              <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-400 space-y-4">
                  <p>
                    We are improving our computer vision models for recognizing handwritten digits. We specifically need
                    more variety in handwriting styles, particularly for the numbers 4, 7, and 9.
                  </p>
                  <p>
                    Your data will be used to train a lightweight CNN model. Verification is done instantly using our
                    decentralized agent network powered by 0G Storage and Oasis privacy-preserving compute.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="requirements" className="mt-6">
              <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader>
                  <CardTitle>Data Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                    <li>Images must be 28x28 pixels or larger.</li>
                    <li>Grayscale or black and white only.</li>
                    <li>Digit must be centered.</li>
                    <li>Format: PNG or JPG.</li>
                    <li>No synthetic/generated data (Stable Diffusion/Midjourney).</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="examples" className="mt-6">
              <Card className="bg-zinc-900/50 border-white/10">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="aspect-square bg-zinc-800 rounded flex items-center justify-center text-2xl font-mono">
                      7
                    </div>
                    <div className="aspect-square bg-zinc-800 rounded flex items-center justify-center text-2xl font-mono">
                      4
                    </div>
                    <div className="aspect-square bg-zinc-800 rounded flex items-center justify-center text-2xl font-mono">
                      9
                    </div>
                    <div className="aspect-square bg-zinc-800 rounded flex items-center justify-center text-2xl font-mono">
                      1
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">Reference samples</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-primary" />
                Upload Data
              </CardTitle>
              <CardDescription>Upload your dataset to begin the verification process.</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadState === "idle" && (
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="dataset">Dataset File (ZIP/PNG)</Label>
                    <Input id="dataset" type="file" className="cursor-pointer bg-background border-white/10" />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I certify that I own this data and it meets the privacy requirements.
                    </label>
                  </div>
                  <Button type="submit" className="w-full">
                    Submit for Verification
                  </Button>
                </form>
              )}

              {uploadState === "uploading" && (
                <div className="text-center py-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Uploading to 0G Storage...</p>
                </div>
              )}

              {uploadState === "verifying" && (
                <div className="text-center py-8 space-y-4">
                  <div className="animate-pulse rounded-full h-12 w-12 bg-primary/20 flex items-center justify-center mx-auto">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-primary font-medium">Running Verification Agent...</p>
                  <p className="text-xs text-muted-foreground">
                    Checking model improvement (SGDClassifier Partial Fit)
                  </p>
                </div>
              )}

              {uploadState === "success" && (
                <div className="text-center py-8 space-y-4">
                  <div className="rounded-full h-16 w-16 bg-green-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Verified!</h3>
                    <p className="text-green-400">Impact Score: +{impactScore}%</p>
                  </div>
                  <Button onClick={() => setUploadState("idle")} variant="outline">
                    Upload More
                  </Button>
                </div>
              )}

              {uploadState === "error" && (
                <div className="text-center py-8 space-y-4">
                  <div className="rounded-full h-16 w-16 bg-red-500/20 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Rejected</h3>
                    <p className="text-red-400">Data did not improve model accuracy.</p>
                  </div>
                  <Button onClick={() => setUploadState("idle")} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Submissions</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Earned</span>
                <span className="font-bold text-green-400">450 USDC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. Impact</span>
                <span className="font-bold text-primary">+0.4%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                      0x{i}F
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">User_84{i}</div>
                      <div className="text-xs text-muted-foreground">+{1.2 - i * 0.2}% impact</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

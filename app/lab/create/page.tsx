import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CreateBounty() {
  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Data Bounty</h1>
      <Card className="bg-zinc-900/50 border-white/10">
        <CardHeader>
          <CardTitle>Bounty Details</CardTitle>
          <CardDescription>Define the data you need and the rewards for contributors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Bounty Title</Label>
            <Input
              id="title"
              placeholder="e.g. Diverse Face Dataset for Emotion Recognition"
              className="bg-zinc-950 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description & Requirements</Label>
            <Textarea
              id="description"
              placeholder="Describe exactly what data you are looking for..."
              className="min-h-[150px] bg-zinc-950 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reward">Base Reward (USDC)</Label>
              <Input id="reward" type="number" placeholder="50" className="bg-zinc-950 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget (USDC)</Label>
              <Input id="budget" type="number" placeholder="5000" className="bg-zinc-950 border-white/10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-file">Target Model (scikit-learn/PyTorch)</Label>
            <Input id="model-file" type="file" className="cursor-pointer bg-zinc-950 border-white/10" />
            <p className="text-xs text-muted-foreground">
              Upload the initial model file for the agent to perform incremental learning checks.
            </p>
          </div>

          <div className="pt-4">
            <Button className="w-full">Deploy Bounty Smart Contract</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

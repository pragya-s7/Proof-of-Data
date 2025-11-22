import { BountyCard } from "@/components/bounty-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function BountyMarketplace() {
  const bounties = [
    {
      id: "1",
      title: "Handwritten Digit Recognition Dataset",
      labName: "OpenAI Research",
      reward: "500",
      tags: ["Computer Vision", "MNIST", "Image"],
      timeLeft: "2 days left",
      difficulty: "Easy" as const,
    },
    {
      id: "2",
      title: "Medical X-Ray Classification (Pneumonia)",
      labName: "Stanford Med AI",
      reward: "2500",
      tags: ["Healthcare", "X-Ray", "High Quality"],
      timeLeft: "5 days left",
      difficulty: "Hard" as const,
    },
    {
      id: "3",
      title: "Autonomous Driving: Urban Street Scenes",
      labName: "Tesla AI",
      reward: "1200",
      tags: ["Video", "Segmentation", "LiDAR"],
      timeLeft: "1 week left",
      difficulty: "Medium" as const,
    },
    {
      id: "4",
      title: "Conversational Python Code Snippets",
      labName: "Anthropic",
      reward: "800",
      tags: ["NLP", "Code", "Python"],
      timeLeft: "3 days left",
      difficulty: "Medium" as const,
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Bounties</h2>
          <p className="text-muted-foreground">Discover tasks and contribute data to earn rewards.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bounties..." className="pl-8 bg-zinc-900/50 border-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bounties.map((bounty) => (
          <BountyCard key={bounty.id} {...bounty} />
        ))}
      </div>
    </div>
  )
}

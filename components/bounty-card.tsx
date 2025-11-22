import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Coins } from "lucide-react"

interface BountyCardProps {
  id: string
  title: string
  labName: string
  reward: string
  tags: string[]
  timeLeft: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export function BountyCard({ id, title, labName, reward, tags, timeLeft, difficulty }: BountyCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-white/10 bg-zinc-900/50 transition-all hover:border-primary/50 hover:bg-zinc-900">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mb-2">
            {labName}
          </Badge>
          <Badge
            variant="secondary"
            className={
              difficulty === "Easy"
                ? "bg-green-500/10 text-green-500"
                : difficulty === "Medium"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
            }
          >
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl text-white line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/5 text-zinc-400 hover:bg-white/10">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center">
            <Coins className="mr-2 h-4 w-4 text-yellow-500" />
            <span className="text-white font-medium">{reward} USDC</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {timeLeft}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/consumer/bounties/${id}`} className="w-full">
          <Button className="w-full bg-white/5 hover:bg-primary hover:text-white transition-all">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

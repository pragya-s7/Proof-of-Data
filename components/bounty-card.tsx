import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Coins, ArrowRight } from "lucide-react"

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
    <Card className="flex flex-col overflow-hidden border border-white/10 bg-zinc-900/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-purple-500/30 group rounded-2xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono text-xs px-2 py-1">
            {labName}
          </Badge>
          <Badge
            className={
              difficulty === "Easy"
                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20 shadow-none"
                : difficulty === "Medium"
                  ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20 shadow-none"
                  : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20 shadow-none"
            }
          >
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg font-medium text-white leading-tight group-hover:text-purple-400 transition-colors">
            {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/5 text-zinc-400 hover:bg-white/10 font-normal border-transparent">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm border-t border-white/5 pt-4">
          <div className="flex items-center text-white font-semibold">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mr-2">
                <Coins className="h-4 w-4 text-yellow-500" />
            </div>
            {reward} <span className="text-zinc-500 font-normal ml-1">USDC</span>
          </div>
          <div className="flex items-center text-zinc-500 text-xs font-mono">
            <Clock className="mr-1 h-3 w-3" />
            {timeLeft}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={`/consumer/bounties/${id}`} className="w-full">
          <Button variant="outline" className="w-full rounded-xl border-white/10 bg-transparent hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 transition-all group-hover:translate-x-1 text-zinc-300">
            View Details <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
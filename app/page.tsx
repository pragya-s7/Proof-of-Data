import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Sparkles } from "lucide-react"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          The Decentralized Marketplace <br className="hidden sm:inline" />
          for Frontier AI Data.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Earn crypto by providing high-quality data to train the next generation of AI models. Verified by 0G and
          Oasis.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8 mt-8">
        <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-zinc-900/50 p-8 transition-all hover:bg-zinc-900">
          <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">For Contributors</h3>
          <p className="text-zinc-400 mb-6">
            Browse data bounties, upload datasets, and get paid instantly via smart contracts when your data improves
            the model.
          </p>
          <Link href="/consumer/bounties">
            <Button className="w-full group-hover:bg-primary/90">
              Start Earning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-zinc-900/50 p-8 transition-all hover:bg-zinc-900">
          <div className="mb-4 rounded-full bg-purple-500/10 w-12 h-12 flex items-center justify-center">
            <Database className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">For AI Labs</h3>
          <p className="text-zinc-400 mb-6">
            Request specific datasets, verify quality with decentralized agents, and train models faster at a fraction
            of the cost.
          </p>
          <Link href="/lab/dashboard">
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 bg-transparent">
              Create Bounty
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

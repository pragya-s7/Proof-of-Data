import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BrainCircuit, Coins, Database, Globe, ShieldCheck, UploadCloud, Wallet, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative border-b border-white/10">
        <div className="container grid lg:grid-cols-2 gap-12 py-20 lg:py-32 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 relative z-10">
            <h1 className="text-5xl lg:text-7xl font-medium tracking-tight leading-[1.1]">
              The decentralized marketplace for <br/>
              <span className="text-purple-gradient font-semibold">frontier AI data.</span>
            </h1>
            
            {/* List Items */}
            <div className="space-y-8 pt-8 max-w-md">
              <div className="group">
                <div className="text-2xl text-zinc-700 font-mono mb-2">01</div>
                <h3 className="text-xl font-medium mb-2 text-white">For Contributors</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Upload high-quality datasets (text, image, video) and earn crypto instantly when verified.
                </p>
              </div>
              <div className="group">
                <div className="text-2xl text-zinc-700 font-mono mb-2">02</div>
                <h3 className="text-xl font-medium mb-2 text-white">For AI Labs</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Request specific data bounties. Train models faster at a fraction of the cost of traditional scraping.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/consumer/bounties">
                <Button size="lg" className="rounded-full px-8 h-12 bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-900/20">
                  Start Earning
                </Button>
              </Link>
              <Link href="/lab/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-white/10 bg-transparent text-white hover:bg-white/5">
                  Create Bounty
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative aspect-square lg:h-[600px] lg:w-full flex items-center justify-center">
             <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full opacity-40" />
             
             <div className="relative z-10 w-64 h-64 md:w-96 md:h-96 rounded-full border-[1px] border-white/20 bg-gradient-to-br from-purple-500/10 to-purple-900/10 backdrop-blur-sm shadow-2xl shadow-purple-900/20 animate-in fade-in zoom-in duration-1000 flex items-center justify-center group">
                <div className="w-2/3 h-2/3 rounded-full border-[1px] border-white/10 bg-gradient-to-tl from-purple-500/10 to-transparent backdrop-blur-md flex items-center justify-center">
                    <BrainCircuit className="w-24 h-24 text-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                </div>
             </div>
             
             <div className="absolute top-32 right-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl transform rotate-6 animate-[float_6s_ease-in-out_infinite]">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        <Coins className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-zinc-500">Reward Paid</div>
                        <div className="font-bold text-sm text-green-400">+500 USDC</div>
                    </div>
                </div>
             </div>

             <div className="absolute bottom-20 left-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl transform -rotate-3 animate-[float_8s_ease-in-out_infinite_1s]">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-zinc-500">0G Verification</div>
                        <div className="font-bold text-sm text-blue-400">Passed 99.8%</div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- ARCHITECTURE SECTION --- */}
      <section className="py-24 relative">
        <div className="container text-center max-w-3xl mx-auto mb-20">
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 mb-6 px-4 py-1 rounded-full uppercase tracking-wider text-xs font-semibold border border-purple-500/20">
            Architecture
          </Badge>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-white">
            Powered by <span className="text-purple-gradient">Decentralized Intelligence</span>
          </h2>
          <p className="text-xl text-zinc-400">
            We combine high-speed storage with privacy-preserving compute to create a trustless data economy.
          </p>
        </div>

        {/* --- BENTO GRID LAYOUT --- */}
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-3xl shadow-sm">
            
            {/* CARD 1 */}
            <div className="bg-black p-8 lg:p-12 flex flex-col justify-between min-h-[400px] group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <UploadCloud className="w-32 h-32 text-purple-500" />
              </div>
              <div className="space-y-4 relative z-10">
                <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5">Marketplace</Badge>
                <h3 className="text-3xl font-medium text-white">Data Contributors</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Everyday users provide raw data (images, text, audio) based on active bounties. Simply upload files and wait for verification.
                </p>
              </div>
              <div className="mt-8">
                 <Link href="/consumer/bounties" className="text-purple-400 font-medium inline-flex items-center hover:underline">
                    View Open Bounties <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-black p-8 lg:p-12 flex flex-col justify-between min-h-[400px] group">
              <div className="space-y-4 relative z-10">
                <h3 className="text-3xl font-medium text-white">AI Verification Agent</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Instead of humans, we use 0G Compute nodes to run lightweight AI models that inspect your data quality instantly.
                </p>
              </div>
               <div className="mt-8 flex justify-center">
                 <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping"></div>
                    <div className="relative bg-black border border-purple-500/30 rounded-full w-24 h-24 flex items-center justify-center">
                        <BrainCircuit className="h-10 w-10 text-purple-500" />
                    </div>
                 </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-black p-8 lg:p-12 flex flex-col justify-between min-h-[400px] md:col-span-2 lg:col-span-1 group">
              <div className="space-y-4 relative z-10">
                <h3 className="text-3xl font-medium text-white">Smart Settlement</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Payments are handled by Oasis Sapphire smart contracts, ensuring privacy and instant payouts upon verification.
                </p>
              </div>
              <div className="mt-8 flex justify-center items-end gap-2">
                 <div className="w-16 h-24 bg-green-500/5 border border-green-500/20 rounded-xl flex flex-col items-center justify-center group-hover:-translate-y-2 transition-transform">
                    <Wallet className="h-6 w-6 text-green-500 mb-2" />
                    <span className="text-xs font-mono text-green-500">USDC</span>
                 </div>
                 <div className="w-16 h-24 bg-purple-500/5 border border-purple-500/20 rounded-xl flex flex-col items-center justify-center group-hover:translate-y-2 transition-transform delay-75">
                    <Globe className="h-6 w-6 text-purple-500 mb-2" />
                    <span className="text-xs font-mono text-purple-500">A0GI</span>
                 </div>
              </div>
            </div>

             {/* CARD 4 */}
             <div className="bg-black p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:col-span-3 min-h-[300px] items-center">
                <div className="space-y-4 flex-1">
                    <h3 className="text-3xl font-medium text-white">Built on 0G Storage</h3>
                    <p className="text-zinc-400 leading-relaxed max-w-2xl">
                    We utilize the 0G Data Availability layer to store massive datasets cheaply and permanently. 
                    This ensures that AI models trained on DeTrain are reproducible and transparent.
                    </p>
                </div>
                <div className="flex-1 flex justify-center w-full">
                     <div className="relative w-full h-48 bg-black border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                         <div className="flex gap-4">
                             {[1,2,3].map((i) => (
                                 <div key={i} className={`w-16 h-16 bg-white/5 border border-purple-500/30 shadow-sm rounded-lg flex items-center justify-center animate-pulse`} style={{animationDelay: `${i * 200}ms`}}>
                                     <Database className="h-6 w-6 text-purple-500" />
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>
             </div>

          </div>
        </div>
      </section>
      
      {/* --- NEW GIANT CTA SECTION --- */}
      <section className="py-24 container">
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-b from-purple-900/10 to-black p-12 md:p-24 text-center">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-8">
                <div className="h-16 w-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] mb-4">
                    <Zap className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                    Ready to power the <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400">Intelligence Revolution?</span>
                </h2>
                
                <p className="text-xl text-zinc-400 max-w-xl">
                    Join thousands of data contributors and top AI labs building the future of decentralized intelligence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                    <Link href="/consumer/bounties" className="w-full sm:w-auto">
                        <Button className="w-full h-14 rounded-full text-lg font-medium bg-white text-black hover:bg-zinc-200 px-8">
                            Start Contributing Now
                        </Button>
                    </Link>
                    <Link href="/lab/dashboard" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full h-14 rounded-full text-lg font-medium border-white/10 bg-white/5 hover:bg-white/10 text-white px-8">
                            Launch a Lab
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </section>

    </div>
  )
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Database, Activity, DollarSign, MoreHorizontal, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function LabDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-medium tracking-tight text-white">Lab Dashboard</h1>
                <p className="text-zinc-400">Manage your bounties and verify incoming data streams.</p>
            </div>
            <Link href="/lab/create">
                <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-900/20">
                    <Plus className="mr-2 h-4 w-4" /> Create New Bounty
                </Button>
            </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-sm rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                    <DollarSign className="h-24 w-24 text-purple-500" />
                </div>
                <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Total Spent</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-medium text-white">12,500 USDC</div>
                    <div className="text-xs text-green-400 mt-1 flex items-center">
                        <Activity className="h-3 w-3 mr-1" /> +12% from last month
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-sm rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                    <Database className="h-24 w-24 text-purple-500" />
                </div>
                <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Active Bounties</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-medium text-white">3</div>
                    <div className="text-xs text-zinc-500 mt-1">
                        Running on 0G Compute
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-sm rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                    <Activity className="h-24 w-24 text-purple-500" />
                </div>
                <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Data Points Verified</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-medium text-white">8,291</div>
                    <div className="text-xs text-purple-400 mt-1">
                        99.2% Quality Score
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-zinc-900/50 border border-white/10 backdrop-blur-sm shadow-sm rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-medium text-white">Active Campaigns</h3>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input placeholder="Search..." className="pl-9 rounded-full bg-zinc-950 border-white/10 text-white focus:border-purple-500 transition-all" />
                </div>
            </div>
            <CardContent className="p-0">
            <Table>
                <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/10">
                    <TableHead className="pl-6 text-zinc-400">Title</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Submissions</TableHead>
                    <TableHead className="text-zinc-400">Spent / Budget</TableHead>
                    <TableHead className="text-right pr-6 text-zinc-400">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow className="hover:bg-white/5 border-white/10 transition-colors group">
                    <TableCell className="font-medium pl-6 text-white">
                        <div className="flex flex-col">
                            <span>Handwritten Digit Recognition</span>
                            <span className="text-xs text-zinc-500 font-normal">ID: #8291</span>
                        </div>
                    </TableCell>
                    <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 font-mono text-xs">
                        Active
                    </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-zinc-400">1,234</TableCell>
                    <TableCell className="font-mono text-zinc-400">4,500 / 5,000 USDC</TableCell>
                    <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </TableCell>
                </TableRow>
                <TableRow className="hover:bg-white/5 border-white/10 transition-colors group">
                    <TableCell className="font-medium pl-6 text-white">
                        <div className="flex flex-col">
                            <span>Iris Flower Classification</span>
                            <span className="text-xs text-zinc-500 font-normal">ID: #8211</span>
                        </div>
                    </TableCell>
                    <TableCell>
                    <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-white/10 font-mono text-xs">
                        Closed
                    </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-zinc-400">500</TableCell>
                    <TableCell className="font-mono text-zinc-400">1,000 / 1,000 USDC</TableCell>
                    <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </TableCell>
                </TableRow>
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
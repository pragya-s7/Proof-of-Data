import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, Trash2, Bookmark } from "lucide-react"

export default function ConsumerDashboard() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,250 USDC</div>
            <p className="text-xs text-green-500 mt-1">+120 USDC this week</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Impact Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">Top 5%</div>
            <p className="text-xs text-primary mt-1">Consistent High Quality</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">42</div>
            <p className="text-xs text-muted-foreground mt-1">8 Pending Verification</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="bg-zinc-900/50">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="mt-6 space-y-4">
          <Card className="bg-zinc-900/30 border-white/10">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Medical X-Ray Classification</h3>
                <p className="text-sm text-muted-foreground">Stanford Med AI • Due in 5 days</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-yellow-500/10 text-yellow-500">Draft</Badge>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button>Continue</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted" className="mt-6 space-y-4">
          <Card className="bg-zinc-900/30 border-white/10">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Handwritten Digit Recognition</h3>
                <p className="text-sm text-muted-foreground">OpenAI Research • Verified 2 hrs ago</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-green-500">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Paid 50 USDC
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/30 border-white/10">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Autonomous Driving Scenes</h3>
                <p className="text-sm text-muted-foreground">Tesla AI • Submitted 1 day ago</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-yellow-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Verification
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-6 space-y-4">
          <Card className="bg-zinc-900/30 border-white/10">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Conversational Python Code</h3>
                <p className="text-sm text-muted-foreground">Anthropic • 800 USDC</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Bookmark className="h-4 w-4 fill-current" />
                </Button>
                <Button>View Bounty</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

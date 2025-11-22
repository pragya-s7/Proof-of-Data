import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <MainNav />
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium">
            <Icons.wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}

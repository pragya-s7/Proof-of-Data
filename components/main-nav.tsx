"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6 text-primary" />
        <span className="inline-block font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          DeTrain
        </span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/consumer/bounties"
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname?.startsWith("/consumer") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Consumer
        </Link>
        <Link
          href="/lab/dashboard"
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname?.startsWith("/lab") ? "text-foreground" : "text-foreground/60",
          )}
        >
          AI Lab
        </Link>
      </nav>
    </div>
  )
}

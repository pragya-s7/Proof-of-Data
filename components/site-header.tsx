"use client" // Add this at the top
import { MainNav } from "@/components/main-nav"
import { ConnectButton } from "@rainbow-me/rainbowkit" // Import this

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <MainNav />
        <div className="flex items-center space-x-4">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </div>
    </header>
  )
}
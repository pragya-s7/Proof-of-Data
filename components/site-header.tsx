"use client"
import { MainNav } from "@/components/main-nav"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useSignMessage } from "wagmi"
import { Button } from "@/components/ui/button"
import { useSession } from "./session-provider"

export function SiteHeader() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { isAuthenticated, isLoading } = useSession()

  const handleSignIn = async () => {
    if (!address) {
      console.error("No address found")
      return
    }

    try {
      const message = "Sign in to DeTrain to prove you are the owner of this address"
      const signature = await signMessageAsync({ message })

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature, message }),
      })

      const data = await response.json()

      if (data.success) {
        console.log("Sign-in successful")
        window.location.reload()
      } else {
        console.error("Sign-in failed:", data.message)
      }
    } catch (error) {
      console.error("Error signing message:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        console.log("Sign-out successful")
        window.location.reload()
      } else {
        console.error("Sign-out failed:", data.message)
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <MainNav />
        <div className="flex items-center space-x-4">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          {isConnected && !isAuthenticated && (
            <Button onClick={handleSignIn} disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          )}
          {isAuthenticated && (
            <Button onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
"use client";

import { BountyCard } from "@/components/bounty-card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import deployedAddresses from '@/backend/deployed-addresses.json';

export default function BountyMarketplace() {
  const [dataTrainingAddress, setDataTrainingAddress] = useState("");

  useEffect(() => {
    setDataTrainingAddress(deployedAddresses.DataTraining);
  }, []);

  const fakeBounties = [
    {
      id: "2",
      title: "Medical X-Ray Classification (Pneumonia)",
      labName: "Stanford Med AI",
      reward: "2500",
      tags: ["Healthcare", "X-Ray", "High Quality"],
      timeLeft: "5 days left",
      difficulty: "Hard",
    },
    {
      id: "3",
      title: "Autonomous Driving: Urban Street Scenes",
      labName: "Tesla AI",
      reward: "1200",
      tags: ["Video", "Segmentation", "LiDAR"],
      timeLeft: "1 week left",
      difficulty: "Medium",
    },
    {
      id: "4",
      title: "Conversational Python Code Snippets",
      labName: "Anthropic",
      reward: "800",
      tags: ["NLP", "Code", "Python"],
      timeLeft: "3 days left",
      difficulty: "Medium"
    },
  ];

  const realBounty = {
    id: dataTrainingAddress,
    title: "Handwritten Digit Recognition Dataset",
    labName: "OpenAI Research (REAL)",
    reward: "500",
    tags: ["Vision", "MNIST", "Image"],
    timeLeft: "Ongoing",
    difficulty: "Easy",
  };

  const allBounties = dataTrainingAddress ? [realBounty, ...fakeBounties] : fakeBounties;

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient instead of dots */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none h-96" />
      <div className="container py-12 md:py-20 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white">Data Marketplace</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Discover active bounties from top AI labs. Contribute data, pass verification, and earn crypto.
          </p>
          {/* Search Bar */}
          <div className="relative w-full max-w-lg mt-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <Input 
              placeholder="Search by tag, lab, or dataset type..." 
              className="pl-10 h-12 rounded-full bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-purple-500" 
            />
            <div className="absolute inset-y-0 right-1 flex items-center">
              <Button size="sm" variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-white/10 text-zinc-400">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allBounties.map((bounty) => (
            <BountyCard key={bounty.id + (bounty.labName||'')} {...bounty} />
          ))}
        </div>
      </div>
    </div>
  );
}
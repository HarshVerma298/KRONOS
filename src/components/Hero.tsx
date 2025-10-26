// File: src/components/Hero.tsx

import { Button } from "@/components/ui/button";
import { Sparkles, Rocket, Coins } from "lucide-react";

// 1. First, we define the "shape" of the data this component will receive from its parent (Index.tsx).
interface HeroProps {
  address: string | null;
  connectWallet: () => Promise<void>;
}

// 2. Next, update the component to accept 'address' and 'connectWallet' as props.
export const Hero = ({ address, connectWallet }: HeroProps) => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center justify-center overflow-hidden">
      {/* 3. We add a new header section here. This is where the wallet button will live. */}
      {/* It's positioned at the top right of the screen for easy access. */}
      <header className="absolute top-0 right-0 p-6 z-20">
        {address? (
          // If the user's address exists, we show a "Connected" status.
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm font-medium">
            Connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </div>
        ) : (
          // Otherwise, we show the "Connect Wallet" button and attach the onClick function.
          <Button onClick={connectWallet} variant="outline">
            Connect Wallet
          </Button>
        )}
      </header>

      {/* Animated background elements (No changes here) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          {/* Badge (No changes here) */}
          <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">ETHOnline 2025 Hackathon Project</span>
          </div>

          {/* Main Heading (No changes here) */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your AI Guide to{" "}
            <span className="text-gradient">Web3 Mastery</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Learn blockchain by doing. Complete simple on-chain quests, guided by AI, and earn real PYUSD rewards.
          </p>

          {/* The rest of your Hero component remains exactly the same... */}
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2">
              <Rocket className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">AI-Powered Learning</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2">
              <Coins className="w-5 h-5 text-reward" />
              <span className="text-sm font-medium">Real PYUSD Rewards</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Verified On-Chain</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              Start Your Journey
            </Button>
            <Button variant="outline" size="xl">
              View Quests
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">3</div>
              <div className="text-sm text-muted-foreground">Quest Tiers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">100%</div>
              <div className="text-sm text-muted-foreground">On-Chain Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">PYUSD</div>
              <div className="text-sm text-muted-foreground">Real Rewards</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
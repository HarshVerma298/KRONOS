// File: src/pages/Index.tsx

import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { QuestDashboard } from "@/components/QuestDashboard";
import { AIChat } from "@/components/AIChat";
import { TechStack } from "@/components/TechStack";

// Define the "shape" of the data that this page will receive from App.tsx.
interface IndexProps {
  address: string | null;
  connectWallet: () => Promise<void>;
}

// Update the component to accept these props.
const Index = ({ address, connectWallet }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Pass the props down to the components that need them. */}
      <Hero address={address} connectWallet={connectWallet} />
      <Features />

      {/* Only show the QuestDashboard if the user's wallet is connected. */}
      {address && <QuestDashboard address={address} />}
      
      {/* THIS IS THE ONLY CHANGE: We now pass the user's address to the AIChat component. */}
      <AIChat address={address} />
      
      <TechStack />
      
      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center text-muted-foreground">
        <p className="text-sm">
          Project KRONOS - Your AI-Powered Web3 Learning Companion
        </p>
        <p className="text-xs mt-2">
          Built using Blockscout MCP & PayPal PYUSD
        </p>
      </footer>
    </div>
  );
};

export default Index;
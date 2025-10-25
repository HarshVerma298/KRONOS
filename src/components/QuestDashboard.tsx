// File: src/components/QuestDashboard.tsx

import { useState } from "react"; // We need this to manage the state of our quests
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Trophy, Target, CheckCircle2 } from "lucide-react";
// 1. Import the logic functions we created earlier
import { verifySwapQuest, sendPyusdReward } from "@/lib/kronos";

// 2. Define the "shape" of the data this component will receive from its parent (Index.tsx)
interface QuestDashboardProps {
  address: string | null;
}

export const QuestDashboard = ({ address }: QuestDashboardProps) => {
  // 3. We use 'useState' to manage the status of our quest.
  // This allows us to update the UI in real-time.
  const [questStatus, setQuestStatus] = useState<string>("active"); // 'active', 'verifying', 'sending', 'complete', 'error'
  const [isLoading, setIsLoading] = useState(false);

  // 4. This is the main function that will run when the user clicks the button.
  const handleVerifySwapQuest = async () => {
    if (!address) {
      alert("Something went wrong, wallet is not connected.");
      return;
    }

    setIsLoading(true);
    setQuestStatus("Verifying on-chain...");

    const isComplete = await verifySwapQuest(address);

    if (isComplete) {
      setQuestStatus("Quest complete! Sending reward...");
      const txHash = await sendPyusdReward(address, 0.75); // Send 0.75 PYUSD reward for this quest

      if (txHash) {
        setQuestStatus(`Complete! Reward sent.`);
      } else {
        setQuestStatus("Error: Failed to send reward.");
      }
    } else {
      setQuestStatus("Action not found on-chain. Please try again after your transaction is confirmed.");
    }

    setIsLoading(false);
  };


  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Your <span className="text-gradient">Learning Path</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Complete quests to earn rewards and master Web3
          </p>
        </div>

        {/* Wallet Status Card - Now uses the real address */}
        <Card className="mb-8 gradient-card border-border animate-slide-up">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Wallet Connected</h3>
                  {/* 5. We replace the hardcoded address with the real one */}
                  <p className="text-sm text-muted-foreground break-all">{address}</p>
                </div>
              </div>
              {/* (For the demo, we'll keep the earned/done stats static) */}
            </div>
          </CardContent>
        </Card>

        {/* Quest Cards */}
        <div className="grid gap-6">
          {/* For the hackathon, we will focus on making just the "Make Your First Swap" quest functional */}
          <Card className={`gradient-card border-border transition-all animate-slide-up`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">Tier 2</Badge>
                  <CardTitle className="text-xl mb-2">Make Your First Swap</CardTitle>
                  <CardDescription>Use Uniswap to swap tokens on the Sepolia testnet</CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 bg-reward/20 rounded-lg px-3 py-2">
                    <Trophy className="w-4 h-4 text-reward" />
                    <span className="font-bold text-reward">0.75 PYUSD</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Status: {questStatus}</p>
                {/* 6. We connect our handleVerifySwapQuest function to the button's onClick event */}
<Button 
  variant="quest" 
  className="w-full" 
  onClick={handleVerifySwapQuest}
  disabled={isLoading || questStatus.startsWith('Complete')}
>
                  {isLoading? (
                    <>{questStatus}</>
                  ) : questStatus.startsWith('Complete')? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Quest Completed
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Verify My Quest
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
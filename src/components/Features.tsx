import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Coins, Zap, Target, Trophy } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Guidance",
    description: "KRONOS analyzes your progress and provides personalized quest recommendations based on your skill level.",
  },
  {
    icon: Shield,
    title: "Blockscout Verification",
    description: "All quests are verified on-chain using Blockscout MCP, ensuring trustless and transparent progress tracking.",
  },
  {
    icon: Coins,
    title: "Real PYUSD Rewards",
    description: "Earn PayPal's stablecoin PYUSD as you learn. Your rewards are instantly sent to your wallet upon quest completion.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get real-time validation of your on-chain actions. No waiting, no manual verification needed.",
  },
  {
    icon: Target,
    title: "Progressive Learning",
    description: "Start with simple tasks and gradually advance to complex DeFi operations at your own pace.",
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Track your progress with tiers and badges. Compete on leaderboards and showcase your Web3 expertise.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="text-gradient">KRONOS</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The most effective way to learn Web3 - combining AI guidance, on-chain verification, and real financial incentives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="gradient-card border-border hover:scale-105 transition-transform animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

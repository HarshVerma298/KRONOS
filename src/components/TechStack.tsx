import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const technologies = [
  { name: "Blockscout MCP", category: "Data Layer", color: "primary" },
  { name: "PayPal PYUSD", category: "Rewards", color: "reward" },
  { name: "AI/LLM", category: "Intelligence", color: "accent" },
  { name: "Ethereum", category: "Blockchain", color: "primary" },
  { name: "MetaMask", category: "Wallet", color: "accent" },
  { name: "Sepolia Testnet", category: "Network", color: "primary" },
];

export const TechStack = () => {
  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Powered By Loveable
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Built for <span className="text-gradient">ETHOnline 2025</span>
          </h2>
          <p className="text-muted-foreground">
            {/* Competing for Blockscout's "Vibe Code" and PayPal's "PYUSD Possibilities" prizes */}
          </p>
        </div>

        <Card className="gradient-card border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:scale-105 transition-transform animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="font-bold text-lg mb-1">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.category}</div>
                </div>
              ))}
            </div>

            
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

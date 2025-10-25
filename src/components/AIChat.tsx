// File: src/components/AIChat.tsx

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles } from "lucide-react";
import { getAIResponse } from "../lib/kronos";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  address: string | null;
}

export const AIChat = ({ address }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<any>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!address) {
      alert("Please connect your wallet first to chat with the AI.");
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const aiResponseContent = await getAIResponse(newMessages, address);

    const aiResponse: Message = {
      role: "assistant",
      content: aiResponseContent,
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">AI Co-Pilot</span>
          </h2>
          <p className="text-muted-foreground">
            Chat with KRONOS to get personalized guidance and quest recommendations
          </p>
        </div>

        <Card className="gradient-card border-border h-[600px] flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>KRONOS AI</span>
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <p className="text-xs font-normal text-muted-foreground">
                  Powered by Blockscout & Groq
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user"? "justify-end" : "justify-start"} animate-slide-up`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                        ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-slide-up">
                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-card border border-border">
                      <p className="text-sm leading-relaxed animate-pulse">KRONOS is thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your on-chain activity..."
                  className="flex-1"
                  disabled={!address}
                />
                <Button onClick={handleSend} size="icon" variant="default" disabled={isLoading ||!address}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                KRONOS verifies all actions on-chain using Blockscout
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
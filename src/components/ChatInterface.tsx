import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink, Bot } from "lucide-react";
import { getPerplexityResponse, extractStockSymbol } from "@/services/perplexity";
import { ChatMessage } from "@/types/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";
import { useChart } from "@/contexts/ChartContext";
import { toast } from "@/components/ui/use-toast";

export const ChatInterface: React.FC = () => {
  const { chartData, setChartSymbol } = useChart();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm Tradie, your AI trading copilot. I can help you understand market events, analyze stock movements, and provide insights about company performance. I'll analyze the chart you're looking at and provide relevant insights. Feel free to ask me anything about the markets!",
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastSymbolRef = useRef<string>(chartData.symbol);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (lastSymbolRef.current !== chartData.symbol) {
      setMessages([
        {
          role: "assistant",
          content: `Switched to analyzing ${chartData.symbol}. What would you like to know about this stock?`,
          timestamp: Date.now(),
        }
      ]);
      lastSymbolRef.current = chartData.symbol;
    }
  }, [chartData.symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const symbolData = await extractStockSymbol(input);
      if (symbolData?.symbol) {
        setChartSymbol(symbolData.symbol);
        toast({
          title: "Chart Updated",
          description: `Switched to ${symbolData.symbol.split(":")[1]} based on your query`,
        });
      }

      const response = await getPerplexityResponse(input, chartData);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.content,
        citations: response.citations,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card/50 p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Chat with Tradie</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Currently analyzing: {chartData.symbol} ({chartData.interval})
        </p>
      </div>
      
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-hidden">
        <ScrollArea className="flex-1 h-[calc(100vh-13rem)] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <Card key={index} className={`p-4 ${message.role === "assistant" ? "bg-primary/10" : "bg-secondary/10"}`}>
                <p className="text-sm font-semibold">{message.role === "assistant" ? "Tradie" : "You"}</p>
                <div className="mt-2 text-sm prose prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className="markdown-content"
                    components={MarkdownComponents}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.citations.map((citation, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-xs hover:bg-primary/20"
                        onClick={() => window.open(citation, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Source {idx + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </Card>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-primary p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing market data...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${chartData.symbol} or any market events...`}
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
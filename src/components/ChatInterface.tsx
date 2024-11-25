import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink, Bot } from "lucide-react";
import { getPerplexityResponse } from "@/services/perplexity";
import { ChatMessage } from "@/types/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown/lib/ast-to-react";

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm Tradie, your AI trading copilot. I can help you understand market events, analyze stock movements, and provide insights about company performance. Feel free to ask me anything about the markets!",
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
      const response = await getPerplexityResponse(input);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.content,
        citations: response.citations,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setLoading(false);
    }
  };

  const markdownComponents: Components = {
    h1: ({children}) => <h1 className="text-2xl font-bold mt-4 mb-2 text-primary">{children}</h1>,
    h2: ({children}) => <h2 className="text-xl font-bold mt-3 mb-2 text-primary/90">{children}</h2>,
    h3: ({children}) => <h3 className="text-lg font-bold mt-3 mb-2 text-primary/80">{children}</h3>,
    p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
    ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
    li: ({children}) => <li className="ml-2">{children}</li>,
    code: ({children, className}) => {
      const isInline = !className;
      return isInline ? (
        <code className="bg-secondary/30 px-1 py-0.5 rounded text-primary">{children}</code>
      ) : (
        <code className="block bg-secondary/30 p-3 rounded-lg my-2 text-sm overflow-x-auto">{children}</code>
      );
    },
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2">{children}</blockquote>
    ),
    a: ({children, href}) => (
      <a 
        className="text-primary hover:underline" 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card/50 p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Chat with Tradie</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Ask me about market events, stock movements, or company news</p>
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
                    components={markdownComponents}
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
                <span className="text-sm">Finding Relevant Information...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market events..."
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
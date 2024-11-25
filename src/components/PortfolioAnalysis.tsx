import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink, LineChart } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { getPortfolioAnalysis } from "@/services/perplexity";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export const PortfolioAnalysis: React.FC = () => {
  const { stocks } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ content: string; citations: string[] } | null>(null);

  const handleAnalyzePortfolio = async () => {
    if (stocks.length === 0) {
      toast({
        title: "No stocks in portfolio",
        description: "Add some stocks to get latest news and recommendations",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await getPortfolioAnalysis(stocks);
      setAnalysis(result);
      toast({
        title: "Analysis Updated",
        description: "Latest news and recommendations received",
      });
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      toast({
        title: "Update Failed",
        description: "Couldn't fetch latest stock updates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        onClick={handleAnalyzePortfolio} 
        disabled={stocks.length === 0 || loading}
        className="w-full gap-2 bg-primary hover:bg-primary/90 glow-effect"
      >
        <LineChart className="h-4 w-4" />
        {loading ? "Getting Latest Updates..." : "Get News & Recommendations"}
      </Button>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center p-8"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </motion.div>
        )}

        {analysis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 space-y-4 glass-effect">
              <div className="whitespace-pre-line text-sm leading-relaxed">{analysis.content}</div>
              {analysis.citations && analysis.citations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/20">
                  {analysis.citations.map((citation, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-xs hover:bg-primary/20 bg-background/50"
                      onClick={() => window.open(citation, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Source {idx + 1}
                    </Button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
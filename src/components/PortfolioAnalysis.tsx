import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LineChart, ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { analyzeTechnicalIndicators, IndicatorAnalysis } from "@/services/technicalAnalysis";
import { getPortfolioAnalysis } from "@/services/perplexity";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";

const CircularGauge: React.FC<{
  value: number;
  maxValue?: number;
  color: string;
  size?: number;
  label: string;
  description: string;
}> = ({ value, maxValue = 100, color, size = 120, label, description }) => {
  const normalizedValue = Math.min(Math.max(0, value), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-center" style={{ color }}>
        {description}
      </span>
    </div>
  );
};

export const PortfolioAnalysis: React.FC = () => {
  const { stocks } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [technicalData, setTechnicalData] = useState<Record<string, IndicatorAnalysis>>({});
  const [newsAnalysis, setNewsAnalysis] = useState<{ content: string; citations: string[] } | null>(null);
  const [expandedStocks, setExpandedStocks] = useState<Record<string, boolean>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, any>>({});

  const handleAnalyzePortfolio = async () => {
    if (stocks.length === 0) {
      toast({
        title: "No stocks in portfolio",
        description: "Add some stocks to get analysis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setApiErrors({});
    try {
      const technicalAnalysis: Record<string, IndicatorAnalysis> = {};
      const errors: Record<string, any> = {};

      for (const stock of stocks) {
        try {
          const analysis = await analyzeTechnicalIndicators(stock);
          technicalAnalysis[stock.symbol] = analysis;
          if (analysis.errors) {
            errors[stock.symbol] = analysis.errors;
          }
        } catch (error) {
          console.error(`Error analyzing ${stock.symbol}:`, error);
          errors[stock.symbol] = error instanceof Error ? error.message : String(error);
        }
      }
      setTechnicalData(technicalAnalysis);
      setApiErrors(errors);

      const news = await getPortfolioAnalysis(stocks);
      setNewsAnalysis(news);

      if (Object.keys(errors).length > 0) {
        toast({
          title: "Some Analysis Failed",
          description: "Check the error details for more information",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Updated",
          description: "Latest market data and technical indicators received",
        });
      }
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      toast({
        title: "Update Failed",
        description: "Couldn't fetch analysis data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend: "bullish" | "bearish" | "neutral") => {
    switch (trend) {
      case "bullish":
        return "text-green-500 bg-green-500/10";
      case "bearish":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-yellow-500 bg-yellow-500/10";
    }
  };

  const getIndicatorDetails = (value: number, type: "RSI" | "ADX" | "MACD") => {
    switch (type) {
      case "RSI":
        if (value > 70) return { color: "#ef4444", description: "Overbought" };
        if (value < 30) return { color: "#22c55e", description: "Oversold" };
        return { color: "#eab308", description: "Neutral" };
      case "ADX":
        if (value > 25) return { color: "#22c55e", description: "Strong Trend" };
        return { color: "#eab308", description: "Weak Trend" };
      case "MACD":
        if (value > 0) return { color: "#22c55e", description: "Bullish" };
        return { color: "#ef4444", description: "Bearish" };
      default:
        return { color: "#eab308", description: "Neutral" };
    }
  };

  const toggleExpand = (symbol: string) => {
    setExpandedStocks(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">Portfolio Analysis</h2>
        <Button 
          onClick={handleAnalyzePortfolio} 
          disabled={stocks.length === 0 || loading}
          className="gap-2 bg-primary hover:bg-primary/90 glow-effect"
        >
          <LineChart className="h-4 w-4" />
          {loading ? "Analyzing..." : "Get News & Technical Analysis"}
        </Button>
      </div>

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

        {!loading && Object.keys(apiErrors).length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Some API calls failed. Check the details below.
            </AlertDescription>
          </Alert>
        )}

        {!loading && newsAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 glass-effect">
              <h3 className="text-lg font-semibold mb-4">Market News & Insights</h3>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {newsAnalysis.content}
                </ReactMarkdown>
              </div>
              {newsAnalysis.citations && newsAnalysis.citations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/20">
                  {newsAnalysis.citations.map((citation, idx) => (
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
          </motion.div>
        )}

        {!loading && Object.keys(technicalData).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Technical Analysis</h3>
            {stocks.map((stock) => {
              const analysis = technicalData[stock.symbol];
              const errors = apiErrors[stock.symbol];

              return (
                <Collapsible
                  key={stock.symbol}
                  open={expandedStocks[stock.symbol]}
                  onOpenChange={() => toggleExpand(stock.symbol)}
                >
                  <Card className="p-6 glass-effect">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{stock.symbol}</h3>
                        <p className="text-sm text-muted-foreground">Technical Analysis</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {analysis && (
                          <Badge variant="outline" className={getTrendColor(analysis.overall_trend)}>
                            {analysis.overall_trend.toUpperCase()}
                          </Badge>
                        )}
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {expandedStocks[stock.symbol] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    {errors && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="text-xs font-mono overflow-auto">
                            {JSON.stringify(errors, null, 2)}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {analysis && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <CircularGauge
                            value={analysis.rsi[0]?.value || 50}
                            maxValue={100}
                            color={getIndicatorDetails(analysis.rsi[0]?.value || 50, "RSI").color}
                            label="RSI"
                            description={getIndicatorDetails(analysis.rsi[0]?.value || 50, "RSI").description}
                          />
                          <CircularGauge
                            value={analysis.adx[0]?.value || 0}
                            maxValue={100}
                            color={getIndicatorDetails(analysis.adx[0]?.value || 0, "ADX").color}
                            label="ADX"
                            description={getIndicatorDetails(analysis.adx[0]?.value || 0, "ADX").description}
                          />
                          <CircularGauge
                            value={Math.abs(analysis.macd[0]?.macd || 0)}
                            maxValue={2}
                            color={getIndicatorDetails(analysis.macd[0]?.macd || 0, "MACD").color}
                            label="MACD"
                            description={getIndicatorDetails(analysis.macd[0]?.macd || 0, "MACD").description}
                          />
                        </div>

                        <CollapsibleContent className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Raw Technical Data</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                <h5 className="text-xs text-muted-foreground">RSI Data (1 Month)</h5>
                                <div className="bg-background/50 p-3 rounded-lg text-xs font-mono">
                                  {JSON.stringify(analysis.rsi, null, 2)}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h5 className="text-xs text-muted-foreground">ADX Data (1 Month)</h5>
                                <div className="bg-background/50 p-3 rounded-lg text-xs font-mono">
                                  {JSON.stringify(analysis.adx, null, 2)}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h5 className="text-xs text-muted-foreground">MACD Data (1 Month)</h5>
                                <div className="bg-background/50 p-3 rounded-lg text-xs font-mono">
                                  {JSON.stringify(analysis.macd, null, 2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    )}
                  </Card>
                </Collapsible>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
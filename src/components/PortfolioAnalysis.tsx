import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, LineChart, TrendingUp, TrendingDown, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { analyzeTechnicalIndicators, IndicatorAnalysis } from "@/services/technicalAnalysis";
import { getPortfolioAnalysis } from "@/services/perplexity";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "@/components/markdown/MarkdownComponents";

export const PortfolioAnalysis: React.FC = () => {
  const { stocks } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [technicalData, setTechnicalData] = useState<Record<string, IndicatorAnalysis>>({});
  const [newsAnalysis, setNewsAnalysis] = useState<{ content: string; citations: string[] } | null>(null);
  const [expandedStocks, setExpandedStocks] = useState<Record<string, boolean>>({});

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
    try {
      // Get technical analysis
      const technicalAnalysis: Record<string, IndicatorAnalysis> = {};
      for (const stock of stocks) {
        const analysis = await analyzeTechnicalIndicators(stock);
        technicalAnalysis[stock.symbol] = analysis;
      }
      setTechnicalData(technicalAnalysis);

      // Get market news and insights
      const news = await getPortfolioAnalysis(stocks);
      setNewsAnalysis(news);

      toast({
        title: "Analysis Updated",
        description: "Latest market data and technical indicators received",
      });
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

  const getIndicatorStrength = (value: number, type: "RSI" | "ADX" | "MACD" | "EMA" | "BBANDS") => {
    switch (type) {
      case "RSI":
        if (value > 70) return { strength: "Overbought", color: "text-red-500" };
        if (value < 30) return { strength: "Oversold", color: "text-green-500" };
        return { strength: "Neutral", color: "text-yellow-500" };
      case "ADX":
        if (value > 25) return { strength: "Strong Trend", color: "text-green-500" };
        return { strength: "Weak Trend", color: "text-yellow-500" };
      case "MACD":
        if (value > 0) return { strength: "Bullish", color: "text-green-500" };
        return { strength: "Bearish", color: "text-red-500" };
      case "EMA":
        return { strength: "Value", color: "text-blue-500" };
      case "BBANDS":
        return { strength: "Bands", color: "text-purple-500" };
      default:
        return { strength: "Neutral", color: "text-yellow-500" };
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
              if (!analysis) return null;

              const latestRSI = analysis.rsi[0]?.value || 50;
              const latestADX = analysis.adx[0]?.value || 25;
              const latestMACD = analysis.macd[0]?.macd || 0;
              const latestEMA = analysis.ema[0]?.value || 0;
              const latestBBands = analysis.bbands[0] || { upper_band: 0, middle_band: 0, lower_band: 0 };

              const rsiStatus = getIndicatorStrength(latestRSI, "RSI");
              const adxStatus = getIndicatorStrength(latestADX, "ADX");
              const macdStatus = getIndicatorStrength(latestMACD, "MACD");

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
                        <Badge variant="outline" className={getTrendColor(analysis.overall_trend)}>
                          {analysis.overall_trend.toUpperCase()}
                        </Badge>
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

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>RSI ({latestRSI.toFixed(2)})</span>
                          <span className={rsiStatus.color}>{rsiStatus.strength}</span>
                        </div>
                        <Progress value={latestRSI} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>ADX ({latestADX.toFixed(2)})</span>
                          <span className={adxStatus.color}>{adxStatus.strength}</span>
                        </div>
                        <Progress value={latestADX} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>MACD ({latestMACD.toFixed(2)})</span>
                          <span className={macdStatus.color}>{macdStatus.strength}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {latestMACD > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <Progress value={Math.abs(latestMACD) * 10} className="h-2" />
                        </div>
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
                            <div className="space-y-2">
                              <h5 className="text-xs text-muted-foreground">EMA Data (1 Month)</h5>
                              <div className="bg-background/50 p-3 rounded-lg text-xs font-mono">
                                {JSON.stringify(analysis.ema, null, 2)}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="text-xs text-muted-foreground">Bollinger Bands (1 Month)</h5>
                              <div className="bg-background/50 p-3 rounded-lg text-xs font-mono">
                                {JSON.stringify(analysis.bbands, null, 2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
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
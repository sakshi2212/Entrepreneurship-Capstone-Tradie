import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { analyzeTechnicalIndicators, IndicatorAnalysis } from "@/services/technicalAnalysis";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const PortfolioWidget: React.FC = () => {
  const { stocks } = usePortfolio();
  const [technicalData, setTechnicalData] = useState<Record<string, IndicatorAnalysis>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchTechnicalData = async () => {
      for (const stock of stocks) {
        if (!technicalData[stock.symbol]) {
          setLoading(prev => ({ ...prev, [stock.symbol]: true }));
          try {
            const analysis = await analyzeTechnicalIndicators(stock);
            setTechnicalData(prev => ({
              ...prev,
              [stock.symbol]: analysis
            }));
          } catch (error) {
            console.error(`Error fetching technical data for ${stock.symbol}:`, error);
          } finally {
            setLoading(prev => ({ ...prev, [stock.symbol]: false }));
          }
        }
      }
    };

    fetchTechnicalData();
  }, [stocks]);

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

  const getIndicatorValue = (analysis: IndicatorAnalysis) => {
    const latestRSI = analysis.rsi[0]?.value;
    const latestADX = analysis.adx[0]?.value;
    const latestMACD = analysis.macd[0]?.macd;

    return {
      rsi: latestRSI ? latestRSI.toFixed(2) : "N/A",
      adx: latestADX ? latestADX.toFixed(2) : "N/A",
      macd: latestMACD ? latestMACD.toFixed(2) : "N/A"
    };
  };

  return (
    <Card className="p-6 glass-effect">
      <h3 className="text-xl font-semibold mb-4 gradient-text">Portfolio Overview</h3>
      <div className="space-y-4">
        {stocks.map((stock, index) => (
          <motion.div
            key={`${stock.symbol}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary">{stock.symbol}</h4>
                <p className="text-sm text-muted-foreground">
                  {stock.quantity} shares @ ${stock.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  ${(stock.price * stock.quantity).toFixed(2)}
                </span>
                {stock.price > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            {loading[stock.symbol] ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : technicalData[stock.symbol] ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getTrendColor(technicalData[stock.symbol].overall_trend)}>
                    {technicalData[stock.symbol].overall_trend.toUpperCase()}
                  </Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="text-xs">
                          RSI: {getIndicatorValue(technicalData[stock.symbol]).rsi}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Relative Strength Index</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="text-xs">
                          ADX: {getIndicatorValue(technicalData[stock.symbol]).adx}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average Directional Index</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="text-xs">
                          MACD: {getIndicatorValue(technicalData[stock.symbol]).macd}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Moving Average Convergence Divergence</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ) : null}
          </motion.div>
        ))}
        {stocks.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No stocks in portfolio. Add some stocks to see them here.
          </p>
        )}
      </div>
    </Card>
  );
};
import { useStock } from "@/contexts/StockContext";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

export const TradingViewWidget: React.FC = () => {
  const { stockSymbol } = useStock();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = ""; // Clear previous chart
    const container = document.createElement("div");
    container.className = "tradingview-widget-container__widget h-full w-full";
    containerRef.current.appendChild(container);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: stockSymbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [stockSymbol]);

  return (
    <Card className="h-full w-full overflow-hidden">
      <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
    </Card>
  );
};

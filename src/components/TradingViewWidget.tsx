import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useChart } from "@/contexts/ChartContext";
import { SymbolSwitcher } from "@/components/SymbolSwitcher";

declare global {
  interface Window {
    TradingView?: {
      widget: any;
    };
  }
}

export const TradingViewWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const { chartData, setChartSymbol, setChartInterval } = useChart();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = document.createElement("div");
    container.className = "tradingview-widget-container__widget h-full w-full";
    containerRef.current.appendChild(container);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const widgetOptions = {
      autosize: true,
      symbol: chartData.symbol,
      interval: chartData.interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      enabled_features: ["header_symbol_search"],
      disabled_features: ["header_compare"],
      overrides: {
        "mainSeriesProperties.style": 1,
      },
      studies: [],
    };

    const initWidget = () => {
      if (window.TradingView) {
        if (widgetRef.current) {
          widgetRef.current.remove();
        }

        widgetRef.current = new window.TradingView.widget({
          ...widgetOptions,
          container,
        });

        widgetRef.current.onChartReady(() => {
          widgetRef.current.subscribe("onSymbolChange", (symbolData: any) => {
            const newSymbol = symbolData.name || symbolData;
            if (newSymbol !== chartData.symbol) {
              setChartSymbol(newSymbol);
            }
          });

          widgetRef.current.subscribe("onIntervalChange", (interval: string) => {
            if (interval !== chartData.interval) {
              setChartInterval(interval);
            }
          });
        });
      }
    };

    script.innerHTML = JSON.stringify(widgetOptions);
    containerRef.current.appendChild(script);

    if (window.TradingView) {
      initWidget();
    } else {
      script.addEventListener("load", initWidget);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      if (widgetRef.current) {
        widgetRef.current.remove();
      }
    };
  }, [chartData.symbol, chartData.interval, setChartSymbol, setChartInterval]);

  return (
    <Card className="h-full w-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <SymbolSwitcher />
      </div>
      <div ref={containerRef} className="tradingview-widget-container h-[calc(100%-5rem)] w-full" />
    </Card>
  );
};
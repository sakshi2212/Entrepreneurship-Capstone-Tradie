import { createContext, useContext, useState, useEffect } from "react";

interface ChartData {
  symbol: string;
  interval: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

interface ChartContextType {
  chartData: ChartData;
  setChartSymbol: (symbol: string) => void;
  setChartInterval: (interval: string) => void;
  updateChartData: (data: Partial<ChartData>) => void;
}

const defaultChartData: ChartData = {
  symbol: "NASDAQ:AAPL",
  interval: "D",
  price: undefined,
  change: undefined,
  changePercent: undefined,
};

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chartData, setChartData] = useState<ChartData>(defaultChartData);

  const setChartSymbol = (symbol: string) => {
    if (symbol !== chartData.symbol) {
      setChartData(prev => ({ 
        ...prev, 
        symbol,
        price: undefined,
        change: undefined,
        changePercent: undefined
      }));
    }
  };

  const setChartInterval = (interval: string) => {
    if (interval !== chartData.interval) {
      setChartData(prev => ({ ...prev, interval }));
    }
  };

  const updateChartData = (data: Partial<ChartData>) => {
    setChartData(prev => ({ ...prev, ...data }));
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const symbol = chartData.symbol.includes(":") 
          ? chartData.symbol.split(":")[1] 
          : chartData.symbol;
          
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=YOUR_FINNHUB_API_KEY`);
        const data = await response.json();
        
        if (data.c) {
          updateChartData({
            price: data.c,
            change: data.d,
            changePercent: data.dp
          });
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 10000);
    return () => clearInterval(interval);
  }, [chartData.symbol]);

  return (
    <ChartContext.Provider value={{ chartData, setChartSymbol, setChartInterval, updateChartData }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChart = () => {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error("useChart must be used within a ChartProvider");
  }
  return context;
};
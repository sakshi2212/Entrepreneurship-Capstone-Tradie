import { createContext, useContext, useState } from "react";
import { Stock } from "@/types/api";

interface PortfolioContextType {
  stocks: Stock[];
  addStock: (stock: Stock) => void;
  removeStock: (index: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const addStock = (stock: Stock) => {
    setStocks(prev => [...prev, stock]);
  };

  const removeStock = (index: number) => {
    setStocks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <PortfolioContext.Provider value={{ stocks, addStock, removeStock }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
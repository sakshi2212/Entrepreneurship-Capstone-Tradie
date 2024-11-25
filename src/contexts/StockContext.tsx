import React, { createContext, useContext, useState } from "react";

const StockContext = createContext<any>(null);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockSymbol, setStockSymbol] = useState("NASDAQ:AAPL"); // Default symbol

  return (
    <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);

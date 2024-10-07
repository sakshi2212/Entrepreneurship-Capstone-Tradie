import React, { useEffect, useRef } from "react";
import "./ChartSection.css";

const TradingViewWidget = () => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (widgetRef.current && window.TradingView) {
      new window.TradingView.widget({
        symbol: "NASDAQ:AAPL",       // Stock symbol
        interval: "D",               // Time interval (daily)
        container_id: widgetRef.current.id, 
        width: "100%",               // Full width
        height: "400",               // Set height to match the design
        theme: "dark",               // Dark theme to match your layout
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        studies: ["MACD@tv-basicstudies"],
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650",
      });
    }
  }, []);

  return <div id="tradingview-widget" ref={widgetRef} className="tradingview-container"></div>;
};

const ChartSection = () => {
  return (
    <div className="chart-section">
      <div className="portfolio-info">
        <h3>Your Portfolio</h3>
        <p>
          $60,400.00 <span className="green-text">▲ 2.45% Today</span>
        </p>
      </div>
      <TradingViewWidget />
    </div>
  );
};

export default ChartSection;

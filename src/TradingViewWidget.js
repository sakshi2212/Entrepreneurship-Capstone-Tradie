import React, { useEffect, useRef } from 'react';

const TradingViewWidget = ({ symbol = "NASDAQ:AAPL", interval = "D", theme = "light", height = 500 }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!widgetRef.current) return;  // Ensure ref is ready

    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        symbol: symbol,       // Stock symbol or ticker
        interval: interval,   // Time interval (e.g., "D" for daily)
        container_id: widgetRef.current.id,  // Container ID based on ref
        width: "100%",        // Responsive width
        height: height,       // Height in pixels
        theme: theme,         // Light or dark theme
        locale: "en",         // Language setting
        toolbar_bg: "#f1f3f6",// Background color of the toolbar
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        details: true,
        allow_symbol_change: true,
        studies: ["MACD@tv-basicstudies"], // Example study to add on the chart
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650"
      });
    };

    // Append the script only once after the component mounts
    document.body.appendChild(script);

    // Cleanup the script if the component unmounts
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [symbol, interval, theme, height]);

  return <div id="tradingview-widget" ref={widgetRef} style={{ minHeight: `${height}px` }} />;
};

export default TradingViewWidget;

// import { useEffect, useState } from 'react';

// const TradingViewWidget = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadWidget = () => {
//       const script = document.createElement('script');
//       script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
//       script.type = 'text/javascript';
//       script.async = true;
//       script.onload = () => setIsLoading(false);
//       script.innerHTML = `
//         {
//           "autosize": true,
//           "symbol": "NASDAQ:AAPL",
//           "interval": "D",
//           "timezone": "Etc/UTC",
//           "theme": "dark",
//           "style": "1",
//           "locale": "en",
//           "allow_symbol_change": true,
//           "calendar": false,
//           "support_host": "https://www.tradingview.com"
//         }
//       `;
      
//       const widgetContainer = document.getElementById('tradingview-widget');
//       if (widgetContainer) {
//         widgetContainer.appendChild(script);
//       }
//     };

//     if (document.readyState === 'complete') {
//       loadWidget();
//     } else {
//       window.addEventListener('load', loadWidget);
//       return () => window.removeEventListener('load', loadWidget);
//     }
//   }, []);

//   return (
//     <div className="tradingview-widget-container h-full">
//       {isLoading && (
//         <div className="flex items-center justify-center h-full">
//           <p>Loading TradingView widget...</p>
//         </div>
//       )}
//       <div id="tradingview-widget" className="h-full"></div>
//       <div className="tradingview-widget-copyright">
//         <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
//           <span className="text-primary">Track all markets on TradingView</span>
//         </a>
//       </div>
//     </div>
//   );
// };

// export default TradingViewWidget;

import { useEffect, useState } from 'react';

const TradingViewWidget = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWidget = () => {
      // Check if the widget is already present to avoid duplication
      const existingScript = document.querySelector('script[src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"]');
      const widgetContainer = document.getElementById('tradingview-widget');
      
      if (existingScript || !widgetContainer) return; // Exit if widget already exists

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => setIsLoading(false);
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }
      `;
      
      widgetContainer.appendChild(script);
    };

    loadWidget(); // Load the widget on mount

    // Cleanup function to remove widget on component unmount
    return () => {
      const widgetContainer = document.getElementById('tradingview-widget');
      if (widgetContainer) {
        widgetContainer.innerHTML = ''; // Clear the widget container
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container h-full">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <p>Loading TradingView widget...</p>
        </div>
      )}
      <div id="tradingview-widget" className="h-full"></div>
      <div className="tradingview-widget-copyright">
        {/* <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="text-primary">Track all markets on TradingView</span>
        </a> */}
      </div>
    </div>
  );
};

export default TradingViewWidget;

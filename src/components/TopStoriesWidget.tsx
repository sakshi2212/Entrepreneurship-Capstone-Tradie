import { useEffect } from 'react';

const TopStoriesWidget = () => {
  useEffect(() => {
    const loadWidget = () => {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        feedMode: "all_symbols",
        isTransparent: false,
        displayMode: "regular",
        width: "100%",
        height: 400,
        colorTheme: "dark",
        locale: "en"
      });

      const widgetContainer = document.getElementById('top-stories-widget');
      if (widgetContainer) {
        widgetContainer.appendChild(script);
      }
    };

    // Delay the widget loading to ensure DOM is ready
    const timer = setTimeout(loadWidget, 1000);

    return () => {
      clearTimeout(timer);
      const widgetContainer = document.getElementById('top-stories-widget');
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div id="top-stories-widget" className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="text-primary">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default TopStoriesWidget;
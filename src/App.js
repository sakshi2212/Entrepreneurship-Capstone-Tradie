import React from 'react';
import TradingViewWidget from './TradingViewWidget';

function App() {
  return (
    <div className="App">
      <h1>TradingView Financial Charts</h1>
      {/* Example usage with different symbols */}
      <TradingViewWidget symbol="NASDAQ:GOOGL" interval="D" theme="light" height={500} />
      <TradingViewWidget symbol="NASDAQ:TSLA" interval="H" theme="dark" height={500} />
    </div>
  );
}

export default App;

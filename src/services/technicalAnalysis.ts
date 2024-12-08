import { Stock } from "@/types/api";

const API_KEY = "bd89ff892b8a4199b5ee9eb9644a5b76";
const BASE_URL = "https://api.twelvedata.com";

export interface TechnicalIndicator {
  datetime: string;
  value: number;
}

export interface IndicatorAnalysis {
  symbol: string;
  adx: TechnicalIndicator[];
  rsi: TechnicalIndicator[];
  macd: {
    datetime: string;
    macd: number;
    macd_signal: number;
    macd_hist: number;
  }[];
  ema: TechnicalIndicator[];
  bbands: {
    datetime: string;
    upper_band: number;
    middle_band: number;
    lower_band: number;
  }[];
  overall_trend: "bullish" | "bearish" | "neutral";
  errors?: Record<string, string>;
}

const fetchIndicator = async (endpoint: string, symbol: string): Promise<any> => {
  try {
    const url = `${BASE_URL}/${endpoint}?symbol=${symbol}&interval=1month&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "error") {
      throw new Error(JSON.stringify({
        endpoint,
        error: data.message || "API Error",
        url,
        response: data
      }));
    }

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error(JSON.stringify({
        endpoint,
        error: "Invalid response format",
        url,
        response: data
      }));
    }

    return data.values;
  } catch (error) {
    console.error(`Error fetching ${endpoint} for ${symbol}:`, error);
    throw error;
  }
};

export const analyzeTechnicalIndicators = async (stock: Stock): Promise<IndicatorAnalysis> => {
  const errors: Record<string, string> = {};
  const indicators = {
    adx: [] as TechnicalIndicator[],
    rsi: [] as TechnicalIndicator[],
    macd: [] as any[],
    ema: [] as TechnicalIndicator[],
    bbands: [] as any[],
  };

  try {
    // Fetch each indicator separately to handle individual errors
    try {
      const adxData = await fetchIndicator("adx", stock.symbol);
      indicators.adx = adxData.map((d: any) => ({ 
        datetime: d.datetime, 
        value: parseFloat(d.adx) 
      }));
    } catch (error) {
      errors.adx = error instanceof Error ? error.message : "Failed to fetch ADX data";
    }

    try {
      const rsiData = await fetchIndicator("rsi", stock.symbol);
      indicators.rsi = rsiData.map((d: any) => ({ 
        datetime: d.datetime, 
        value: parseFloat(d.rsi) 
      }));
    } catch (error) {
      errors.rsi = error instanceof Error ? error.message : "Failed to fetch RSI data";
    }

    try {
      const macdData = await fetchIndicator("macd", stock.symbol);
      indicators.macd = macdData;
    } catch (error) {
      errors.macd = error instanceof Error ? error.message : "Failed to fetch MACD data";
    }

    try {
      const emaData = await fetchIndicator("ema", stock.symbol);
      indicators.ema = emaData.map((d: any) => ({ 
        datetime: d.datetime, 
        value: parseFloat(d.ema) 
      }));
    } catch (error) {
      errors.ema = error instanceof Error ? error.message : "Failed to fetch EMA data";
    }

    try {
      const bbandsData = await fetchIndicator("bbands", stock.symbol);
      indicators.bbands = bbandsData;
    } catch (error) {
      errors.bbands = error instanceof Error ? error.message : "Failed to fetch Bollinger Bands data";
    }

    const latestRSI = indicators.rsi[0]?.value || 50;
    const latestADX = indicators.adx[0]?.value || 25;
    const latestMACD = indicators.macd[0]?.macd || 0;
    const latestBBands = indicators.bbands[0] || { upper_band: 0, middle_band: 0, lower_band: 0 };

    let bullishSignals = 0;
    let bearishSignals = 0;

    // RSI Analysis
    if (latestRSI > 70) bearishSignals++;
    else if (latestRSI < 30) bullishSignals++;

    // ADX Analysis
    if (latestADX > 25) {
      if (latestMACD > 0) bullishSignals++;
      else bearishSignals++;
    }

    // MACD Analysis
    if (latestMACD > 0) bullishSignals++;
    else if (latestMACD < 0) bearishSignals++;

    // Bollinger Bands Analysis
    const currentPrice = stock.price;
    if (currentPrice > latestBBands.upper_band) bearishSignals++;
    else if (currentPrice < latestBBands.lower_band) bullishSignals++;

    let overall_trend: "bullish" | "bearish" | "neutral";
    if (bullishSignals > bearishSignals + 1) overall_trend = "bullish";
    else if (bearishSignals > bullishSignals + 1) overall_trend = "bearish";
    else overall_trend = "neutral";

    return {
      symbol: stock.symbol,
      adx: indicators.adx,
      rsi: indicators.rsi,
      macd: indicators.macd,
      ema: indicators.ema,
      bbands: indicators.bbands,
      overall_trend,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error("Error analyzing technical indicators:", error);
    throw new Error(`Failed to analyze technical indicators: ${error instanceof Error ? error.message : String(error)}`);
  }
};
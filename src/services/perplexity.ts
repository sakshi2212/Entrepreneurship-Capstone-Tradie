import { PerplexityResponse, ChartData, Stock } from "@/types/api";

const PERPLEXITY_API_KEY = "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";

const STOCK_MAPPINGS = {
  "APPLE": "NASDAQ:AAPL",
  "AAPL": "NASDAQ:AAPL",
  "TESLA": "NASDAQ:TSLA",
  "TSLA": "NASDAQ:TSLA",
  "MICROSOFT": "NASDAQ:MSFT",
  "MSFT": "NASDAQ:MSFT",
  "AMAZON": "NASDAQ:AMZN",
  "AMZN": "NASDAQ:AMZN",
  "GOOGLE": "NASDAQ:GOOGL",
  "GOOGL": "NASDAQ:GOOGL",
  "META": "NASDAQ:META",
  "FB": "NASDAQ:META",
  "NETFLIX": "NASDAQ:NFLX",
  "NFLX": "NASDAQ:NFLX",
  "NVIDIA": "NASDAQ:NVDA",
  "NVDA": "NASDAQ:NVDA"
};

export const extractStockSymbol = async (query: string): Promise<{ symbol: string | null; confidence: number }> => {
  try {
    const upperQuery = query.toUpperCase();
    for (const [key, value] of Object.entries(STOCK_MAPPINGS)) {
      if (upperQuery.includes(key)) {
        return { symbol: value, confidence: 1 };
      }
    }

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "Extract only the stock symbol from the text. Return in format EXCHANGE:SYMBOL (e.g. NASDAQ:AAPL) or null if no symbol found."
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.1,
        max_tokens: 10,
        stream: false
      })
    });

    const data: PerplexityResponse = await response.json();
    const extractedSymbol = data.choices[0].message.content.trim();
    
    if (extractedSymbol === "null" || !extractedSymbol.includes(":")) {
      return { symbol: null, confidence: 0 };
    }

    return { 
      symbol: extractedSymbol,
      confidence: 1
    };
  } catch (error) {
    console.error("Error extracting symbol:", error);
    return { symbol: null, confidence: 0 };
  }
};

export const getPerplexityResponse = async (
  userMessage: string,
  chartData: ChartData
): Promise<{ content: string; citations: string[] }> => {
  try {
    const cleanSymbol = chartData.symbol.includes(":") 
      ? chartData.symbol.split(":")[1] 
      : chartData.symbol;

    const systemMessage = `You are a stock market analyst focused solely on ${cleanSymbol}. Current timeframe: ${chartData.interval}${
      chartData.price 
        ? `. Price: $${chartData.price.toFixed(2)}${
            chartData.changePercent 
              ? ` (${chartData.changePercent > 0 ? "+" : ""}${chartData.changePercent.toFixed(2)}%)`
              : ""
          }`
        : "."
    }

Rules:
1. Only discuss ${cleanSymbol}
2. Provide direct, focused analysis
3. No comparisons to other stocks
4. Keep responses concise and specific`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        stream: false
      })
    });

    const data: PerplexityResponse = await response.json();
    return {
      content: data.choices[0].message.content,
      citations: data.citations || []
    };
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    throw new Error("Failed to get response from AI");
  }
};

export const getPortfolioAnalysis = async (stocks: Stock[]): Promise<{ content: string; citations: string[] }> => {
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "Provide brief, focused analysis for each stock. Format: SYMBOL: Latest news + Clear BUY/HOLD/SELL recommendation."
          },
          {
            role: "user",
            content: `Analysis for: ${stocks.map(s => s.symbol).join(", ")}`
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        stream: false
      })
    });

    const data: PerplexityResponse = await response.json();
    return {
      content: data.choices[0].message.content,
      citations: data.citations || []
    };
  } catch (error) {
    console.error("Error analyzing portfolio:", error);
    throw new Error("Failed to analyze portfolio");
  }
};
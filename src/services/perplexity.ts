import { PerplexityResponse, ChartData, Stock } from "@/types/api";

const PERPLEXITY_API_KEY = "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";

const STOCK_MAPPINGS = {
  // Tech Companies
  "APPLE": "NASDAQ:AAPL",
  "AAPL": "NASDAQ:AAPL",
  "IPHONE": "NASDAQ:AAPL",
  "MACBOOK": "NASDAQ:AAPL",
  "TESLA": "NASDAQ:TSLA",
  "TSLA": "NASDAQ:TSLA",
  "ELON MUSK": "NASDAQ:TSLA",
  "MICROSOFT": "NASDAQ:MSFT",
  "MSFT": "NASDAQ:MSFT",
  "WINDOWS": "NASDAQ:MSFT",
  "AMAZON": "NASDAQ:AMZN",
  "AMZN": "NASDAQ:AMZN",
  "GOOGLE": "NASDAQ:GOOGL",
  "GOOGL": "NASDAQ:GOOGL",
  "ALPHABET": "NASDAQ:GOOGL",
  "META": "NASDAQ:META",
  "FACEBOOK": "NASDAQ:META",
  "FB": "NASDAQ:META",
  "INSTAGRAM": "NASDAQ:META",
  "NETFLIX": "NASDAQ:NFLX",
  "NFLX": "NASDAQ:NFLX",
  "NVIDIA": "NASDAQ:NVDA",
  "NVDA": "NASDAQ:NVDA",
  
  // Financial Companies
  "GOLDMAN SACHS": "NYSE:GS",
  "GOLDMAN": "NYSE:GS",
  "GS": "NYSE:GS",
  "JPMORGAN": "NYSE:JPM",
  "JP MORGAN": "NYSE:JPM",
  "JPM": "NYSE:JPM",
  "BANK OF AMERICA": "NYSE:BAC",
  "BAC": "NYSE:BAC",
  "VISA": "NYSE:V",
  "V": "NYSE:V",
  "MASTERCARD": "NYSE:MA",
  "MA": "NYSE:MA",

  // Other Major Companies
  "DISNEY": "NYSE:DIS",
  "DIS": "NYSE:DIS",
  "COCA COLA": "NYSE:KO",
  "COKE": "NYSE:KO",
  "KO": "NYSE:KO",
  "WALMART": "NYSE:WMT",
  "WMT": "NYSE:WMT",
  "MCDONALDS": "NYSE:MCD",
  "MCD": "NYSE:MCD"
};

export const extractStockSymbol = async (query: string): Promise<{ symbol: string | null; confidence: number }> => {
  try {
    // First try direct mapping from known symbols/companies
    const upperQuery = query.toUpperCase();
    for (const [key, value] of Object.entries(STOCK_MAPPINGS)) {
      if (upperQuery.includes(key)) {
        return { symbol: value, confidence: 1 };
      }
    }

    // If no direct match found, use Perplexity API
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
            content: `You are a stock symbol extraction AI. Your task is to identify company names and stock symbols from text about market performance and company analysis.

When a company or its products are mentioned, map them to their stock symbol:

Tech Companies:
- Apple/iPhone/Mac → NASDAQ:AAPL
- Tesla/Elon Musk → NASDAQ:TSLA
- Microsoft/Windows → NASDAQ:MSFT
- Amazon/AWS → NASDAQ:AMZN
- Google/Alphabet → NASDAQ:GOOGL
- Meta/Facebook/Instagram → NASDAQ:META
- Netflix → NASDAQ:NFLX
- Nvidia → NASDAQ:NVDA

Financial:
- Goldman Sachs → NYSE:GS
- JPMorgan → NYSE:JPM
- Bank of America → NYSE:BAC
- Visa → NYSE:V
- Mastercard → NYSE:MA

Others:
- Disney → NYSE:DIS
- Coca-Cola/Coke → NYSE:KO
- Walmart → NYSE:WMT
- McDonald's → NYSE:MCD

Rules:
1. Return ONLY the exchange:symbol format (e.g. "NASDAQ:AAPL")
2. If no valid symbol found, return "null"
3. If multiple companies mentioned, return the main one being discussed
4. Always include exchange prefix (NASDAQ: or NYSE:)

Examples:
"Apple is performing well" → "NASDAQ:AAPL"
"How's Tesla doing?" → "NASDAQ:TSLA"
"MSFT earnings report" → "NASDAQ:MSFT"
"iPhone sales are up" → "NASDAQ:AAPL"
"Elon's latest tweet" → "NASDAQ:TSLA"
"The market is volatile" → "null"`
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

    const systemMessage = `You are Tradie, an AI trading copilot. The user is currently analyzing ${cleanSymbol} on a ${chartData.interval} timeframe chart${
      chartData.price 
        ? `. Current price: $${chartData.price.toFixed(2)}${
            chartData.changePercent 
              ? ` (${chartData.changePercent > 0 ? "+" : ""}${chartData.changePercent.toFixed(2)}%)`
              : ""
          }`
        : "."
    } Provide concise market insights and trading information based on this context. Always reference the current symbol and timeframe in your responses when relevant.`;

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
            content: `Regarding ${cleanSymbol} (${chartData.interval} timeframe): ${userMessage}`
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
            content: "For each stock symbol, provide only: 1) The latest significant news 2) A clear BUY, HOLD, or SELL recommendation based on recent developments. Keep it brief and direct."
          },
          {
            role: "user",
            content: `Latest news and recommendations for: ${stocks.map(s => s.symbol).join(", ")}`
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
import { PerplexityResponse } from "@/types/api";
import { Stock } from "@/components/PortfolioManager";

const PERPLEXITY_API_KEY = "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";

export const getPerplexityResponse = async (userMessage: string): Promise<{ content: string; citations: string[] }> => {
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
            content: "You are Tradie, an AI trading copilot. Provide concise market insights and trading information based on user queries."
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
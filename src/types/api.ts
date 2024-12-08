export interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  citations: string[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  citations?: string[];
}

export interface ChartData {
  symbol: string;
  interval: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

export interface Stock {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
}
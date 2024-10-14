import axios from 'axios';

const OPENROUTER_API_KEY = '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';
const YOUR_SITE_URL = 'https://your-site-url.com'; // Replace with your actual site URL
const YOUR_APP_NAME = 'AI Trading Copilot';

const systemPrompt = `You are Trading Copilot, an AI assistant designed to provide insights and analysis on stock trading. You have access to the latest news and market data. When asked about specific stocks or market trends, you should provide valuable insights based on recent news and data. Always strive to give actionable advice that can help with trading decisions. Format your responses with numbered lists and use asterisks for emphasis where appropriate.`;

export const chatWithOpenRouter = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/llama-3.1-sonar-huge-128k-online',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': YOUR_SITE_URL,
          'X-Title': YOUR_APP_NAME,
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    return `AI: ${aiResponse}`;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw new Error('Failed to get a response from the AI. Please try again.');
  }
};
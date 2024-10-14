import Head from 'next/head'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import FeaturesSection from '@/components/FeaturesSection'
import InfoBox from '@/components/InfoBox'
import TickerTapeWidget from '@/components/TickerTapeWidget'
import TopStoriesWidget from '@/components/TopStoriesWidget'
import { ErrorBoundary } from 'react-error-boundary'
import { TrendingUp, DollarSign, BarChart2, AlertCircle, User, Bot } from 'lucide-react'
import { chatWithOpenRouter } from '@/services/openRouterService'

const TradingViewWidget = dynamic(() => import('@/components/TradingViewWidget'), { ssr: false })

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-md">
      <p>Something went wrong:</p>
      <pre className="mt-2">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Try again</button>
    </div>
  )
}

export default function TradingPlatform() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Trading Copilot. How can I assist you with your trading analysis today?' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { role: 'user', content: input }]
      setMessages(newMessages)
      setInput('')
      setIsLoading(true)

      try {
        const aiResponse = await chatWithOpenRouter(newMessages)
        setMessages([...newMessages, { role: 'assistant', content: aiResponse }])
      } catch (error) {
        setMessages([...newMessages, { role: 'assistant', content: 'AI: I apologize, but I encountered an error while processing your request. Please try again.' }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <Head>
        <title>AI Trading Copilot</title>
        <meta name="description" content="Interactive platform to talk with trading charts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <TickerTapeWidget />
        <main className="flex-grow p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-3/5 space-y-4">
              <div className="h-[600px] lg:h-[500px]">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <TradingViewWidget />
                </ErrorBoundary>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoBox title="Market Trend" content="Bullish momentum detected" icon={TrendingUp} />
                <InfoBox title="Volume Analysis" content="Above average trading volume" icon={BarChart2} />
                <InfoBox title="Key Support" content="Strong support at $150" icon={DollarSign} />
                <InfoBox title="Risk Alert" content="High volatility expected" icon={AlertCircle} />
              </div>
            </div>
            <div className="w-full lg:w-2/5 flex flex-col">
              <Card className="flex-grow">
                <CardHeader>
                  <CardTitle>Chat with AI Trading Copilot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[400px] overflow-y-auto bg-muted p-4 rounded-md">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex items-start space-x-2 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'assistant' && <Bot className="w-6 h-6 text-blue-500" />}
                        <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="font-semibold mb-1">{message.role === 'user' ? 'You' : 'AI'}</p>
                          <p dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                        {message.role === 'user' && <User className="w-6 h-6 text-blue-500" />}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center space-x-2">
                        <Bot className="w-6 h-6 text-blue-500" />
                        <p className="text-gray-500">AI is thinking...</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about the trading chart..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Separator className="my-4" />
          <FeaturesSection />
          <Separator className="my-4" />
          <TopStoriesWidget />
        </main>
      </div>
    </>
  )
}
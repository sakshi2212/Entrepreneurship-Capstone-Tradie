import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartBar, TrendingUp, Volume2, LineChart, Newspaper, HelpCircle } from 'lucide-react'

const FeatureItem = ({ icon: Icon, title, items, colorClass }) => (
  <Card className={`${colorClass} text-white`}>
    <CardHeader className="flex flex-row items-center space-x-2">
      <Icon size={24} />
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

const FeaturesSection = () => {
  const features = [
    { icon: ChartBar, title: "Real-time Analysis", items: ["Market data analysis", "Volume analysis"], colorClass: "bg-blue-600" },
    { icon: TrendingUp, title: "Historical Insights", items: ["Price trend insights", "Support/resistance levels"], colorClass: "bg-green-600" },
    { icon: LineChart, title: "Technical Indicators", items: ["Moving averages", "Other technical indicators"], colorClass: "bg-purple-600" },
    { icon: Newspaper, title: "News Impact", items: ["News impact assessment", "Market sentiment analysis"], colorClass: "bg-orange-600" },
  ]

  const questions = [
    "What's the current trend for this stock?",
    "How does the trading volume compare to the average?",
    "Can you explain the recent price movement?",
    "What do the moving averages indicate?",
    "Are there any significant support or resistance levels?",
  ]

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Available Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-4">Example Questions</h2>
      <Card className="bg-teal-600 text-white">
        <CardHeader className="flex flex-row items-center space-x-2">
          <HelpCircle size={24} />
          <CardTitle>What You Can Ask</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

export default FeaturesSection
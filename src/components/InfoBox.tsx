import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LucideIcon } from 'lucide-react'

interface InfoBoxProps {
  title: string
  content: string
  icon: LucideIcon
}

const InfoBox = ({ title, content, icon: Icon }: InfoBoxProps) => {
  return (
    <Card className="bg-accent text-accent-foreground">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Icon size={24} />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  )
}

export default InfoBox
import { Card, CardContent } from '@/components/ui/card'

export default function AnalyticsPanel() {
  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">📊 Performance Insights</h2>
        <ul className="space-y-2">
          <li>📰 Views This Week: <strong>8,245</strong></li>
          <li>🔁 Shares: <strong>1,092</strong></li>
          <li>💬 Comments: <strong>367</strong></li>
          <li>🔥 Top Headline: <strong>“AI Declares Independence”</strong></li>
        </ul>
      </CardContent>
    </Card>
  )
}

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function EarningsDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Simulated data — replace with Supabase fetch later
    setTimeout(() => {
      setStats({
        totalRevenue: '$542.80',
        views: 18632,
        clicks: 982,
        cpm: '$2.91',
        ctr: '5.2%',
        topPost: '“AI Declares Independence”',
      })
    }, 1000)
  }, [])

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">💰 Earnings & Performance</h2>

        {!stats ? (
          <p className="text-muted-foreground text-sm">Loading insights...</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-800">
            <li><strong>Total Revenue:</strong> {stats.totalRevenue}</li>
            <li><strong>Post Views:</strong> {stats.views.toLocaleString()}</li>
            <li><strong>Ad Clicks:</strong> {stats.clicks}</li>
            <li><strong>CPM:</strong> {stats.cpm}</li>
            <li><strong>CTR:</strong> {stats.ctr}</li>
            <li><strong>Top Performing Post:</strong> {stats.topPost}</li>
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AIHeadlineOptimizer() {
  const [headline, setHeadline] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const generateHeadlines = async () => {
    setLoading(true)
    setSuggestions([])

    // Simulated AI-generated results (replace with real API later)
    setTimeout(() => {
      setSuggestions([
        {
          text: '🌍 Global Water Crisis Looms Closer Than Predicted',
          note: 'Emotionally resonant + urgency',
        },
        {
          text: '💡 AI Can Assist, But Journalists Still Lead',
          note: 'Balanced & ethical tone',
        },
        {
          text: '🚨 The Truth Behind the 2030 Water Prediction',
          note: 'Click-through optimized curiosity',
        },
      ])
      setLoading(false)
    }, 2000)
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🧠 AI Headline Optimizer</h2>
        <Input
          placeholder="Type your current headline..."
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
        <Button onClick={generateHeadlines} disabled={loading || !headline.trim()}>
          {loading ? 'Optimizing...' : 'Suggest Headlines'}
        </Button>

        {suggestions.length > 0 && (
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-slate-100 border rounded p-2">
                <strong>{s.text}</strong>
                <p className="text-slate-500 italic">🧠 {s.note}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

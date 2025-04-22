import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function PressRewriter() {
  const [input, setInput] = useState('')
  const [rewritten, setRewritten] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRewrite = () => {
    if (!input.trim()) return
    setLoading(true)
    setRewritten('')

    // Simulated AI output — replace with real API later
    setTimeout(() => {
      setRewritten(
        `📝 Rewritten: In a bold move, the organization announced today its commitment to reducing emissions by 80% by 2035, aiming to become an industry leader in environmental responsibility.`
      )
      setLoading(false)
    }, 2000)
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">✍️ AI Press Release Rewriter</h2>

        <Textarea
          rows={5}
          placeholder="Paste the original press release here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button onClick={handleRewrite} disabled={loading || !input.trim()}>
          {loading ? 'Rewriting...' : 'Rewrite with AI'}
        </Button>

        {rewritten && (
          <div className="mt-4 text-sm bg-slate-50 border p-3 rounded text-slate-800 whitespace-pre-wrap">
            {rewritten}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

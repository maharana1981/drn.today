import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function TipInbox() {
  const [tips, setTips] = useState([
    { email: 'anon@protonmail.com', message: 'Govt. document leaked. Check “Project Mirage.”', time: '5 mins ago' },
    { email: 'source@safe.net', message: 'Flooded village photos available. I was there.', time: '2 hours ago' },
  ])

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!message.trim()) return
    setTips([{ email, message, time: 'Just now' }, ...tips])
    setEmail('')
    setMessage('')
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-6 p-4">
        <h2 className="text-xl font-semibold">📨 Public Tip Inbox</h2>

        {/* Submission Form (for future public use or dev test) */}
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            placeholder="Your news tip, report, or message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSubmit}>Submit Tip</Button>
        </div>

        {/* Displayed Inbox */}
        <div className="mt-6 space-y-3">
          {tips.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tips submitted yet.</p>
          ) : (
            tips.map((tip, i) => (
              <div
                key={i}
                className="border p-3 rounded bg-slate-50 text-sm space-y-1"
              >
                <p><strong>📩 From:</strong> {tip.email || 'Anonymous'}</p>
                <p><strong>📝 Message:</strong> {tip.message}</p>
                <p className="text-xs text-muted-foreground">⏱️ {tip.time}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

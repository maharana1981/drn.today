import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function CollaborationRoom() {
  const [messages, setMessages] = useState([
    { from: 'Alex', text: 'Ready to co-write the climate report?' },
    { from: 'Jordan', text: 'Yep! Adding image links now.' },
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'You', text: input }])
      setInput('')
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🤝 Collaboration Room</h2>
        <div className="bg-slate-100 rounded p-2 h-48 overflow-y-auto space-y-2 text-sm">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.from}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}

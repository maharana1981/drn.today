import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function SchedulingAssistant() {
  const [dateTime, setDateTime] = useState('')
  const [suggestion, setSuggestion] = useState(null)

  const handleSuggestTime = () => {
    setSuggestion('🧠 Best Time: Tomorrow at 10:00 AM IST (High engagement predicted)')
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🕒 Smart Scheduling Assistant</h2>

        <div className="space-y-2">
          <Label htmlFor="schedule">Pick a Date & Time</Label>
          <Input
            id="schedule"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => {
              setDateTime(e.target.value)
              setSuggestion(null)
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <Button disabled={!dateTime}>✅ Schedule (Coming Soon)</Button>
          <Button variant="outline" onClick={handleSuggestTime}>
            🧠 Suggest Optimal Time
          </Button>
        </div>

        {suggestion && (
          <div className="text-green-700 text-sm mt-2 border-t pt-2">
            {suggestion}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

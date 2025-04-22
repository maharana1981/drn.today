import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function ContentCalendar() {
  const [entries, setEntries] = useState([
    { date: '2025-04-25', task: 'Post AI interview' },
    { date: '2025-04-27', task: 'Schedule visual story on Mars colony' },
  ])

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">📅 Content Calendar</h2>
        <ul className="space-y-2">
          {entries.map((item, index) => (
            <li key={index} className="border rounded p-2">
              <strong>{item.date}:</strong> {item.task}
            </li>
          ))}
        </ul>
        <Button variant="secondary">Add New Entry (Coming Soon)</Button>
      </CardContent>
    </Card>
  )
}

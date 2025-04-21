import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AIResearchAssistant() {
  const [query, setQuery] = useState("")

  const handleResearch = () => {
    if (!query.trim()) return alert("Enter a topic")
    alert("Researching: " + query)
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🧠 AI Research Assistant</h2>
        <Input
          placeholder="Ask a question or enter a topic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleResearch}>Get Insights</Button>
      </CardContent>
    </Card>
  )
}

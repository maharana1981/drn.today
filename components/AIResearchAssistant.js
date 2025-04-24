import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AIResearchAssistant() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResearch = async () => {
    if (!query.trim()) return alert("Enter a topic")
    setLoading(true)

    // Simulate AI research response
    setTimeout(() => {
      setResult(`Top insights for "${query}":\n\n1. Insight one with facts.\n2. Insight two with analysis.\n3. Relevant stats and historical context.`)
      setLoading(false)
    }, 1000)
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
        <Button onClick={handleResearch} disabled={loading}>
          {loading ? "Fetching..." : "Get Insights"}
        </Button>
        {result && (
          <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-line">
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

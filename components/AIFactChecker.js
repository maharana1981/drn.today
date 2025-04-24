import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function AIFactChecker() {
  const [text, setText] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)

  const handleFactCheck = async () => {
    setChecking(true)
    setResult(null)

    setTimeout(() => {
      setResult({
        status: 'warning',
        message: 'This paragraph contains 2 claims that need verification.',
        flagged: [
          '“The earth will run out of water by 2030.”',
          '“AI can fully replace journalists.”',
        ],
        sources: [
          { title: 'UN Water Report 2023', url: 'https://www.unwater.org' },
          { title: 'AI & Journalism Ethics - Columbia Journalism Review', url: 'https://cjr.org/ai-journalism' },
        ],
      })
      setChecking(false)
    }, 2000)
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🧠 AI Fact-Checker</h2>
        <Textarea
          rows={4}
          placeholder="Paste a paragraph or quote to verify..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleFactCheck} disabled={checking || !text.trim()}>
          {checking ? 'Checking...' : 'Verify with AI'}
        </Button>

        {result && (
          <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mt-4 space-y-2">
            <p className="font-medium text-yellow-800">{result.message}</p>
            {result.flagged && (
              <ul className="list-disc pl-6 text-sm text-red-700">
                {result.flagged.map((claim, i) => (
                  <li key={i}>⚠️ {claim}</li>
                ))}
              </ul>
            )}
            {result.sources && (
              <div className="text-sm text-blue-700">
                <p className="mt-2 font-semibold">Suggested sources:</p>
                <ul className="pl-5 list-disc">
                  {result.sources.map((source, i) => (
                    <li key={i}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

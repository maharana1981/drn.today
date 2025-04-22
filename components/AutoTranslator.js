import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function AutoTranslator() {
  const [text, setText] = useState('')
  const [translating, setTranslating] = useState(false)
  const [translations, setTranslations] = useState([])

  const handleTranslate = async () => {
    setTranslating(true)
    setTranslations([])

    // Simulated translations — Replace with real API calls later
    setTimeout(() => {
      setTranslations([
        { lang: 'Spanish', text: '🌍 La crisis del agua se avecina más rápido de lo previsto.' },
        { lang: 'Hindi', text: '🌍 जल संकट अपेक्षा से पहले आ रहा है।' },
        { lang: 'French', text: '🌍 La crise de l’eau est plus proche que prévu.' },
      ])
      setTranslating(false)
    }, 2000)
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🌍 AI Auto-Translate & Localizer</h2>
        <Textarea
          rows={3}
          placeholder="Paste your headline or paragraph..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleTranslate} disabled={translating || !text.trim()}>
          {translating ? 'Translating...' : 'Translate'}
        </Button>

        {translations.length > 0 && (
          <div className="mt-4 space-y-2 text-sm text-slate-800">
            {translations.map((t, i) => (
              <div key={i} className="border rounded p-2 bg-slate-50">
                <strong>{t.lang}:</strong> {t.text}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

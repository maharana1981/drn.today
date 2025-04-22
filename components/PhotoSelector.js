import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PhotoSelector() {
  const [keyword, setKeyword] = useState('')
  const [image, setImage] = useState(null)
  const [results, setResults] = useState([])

  const handleSearch = () => {
    // Simulated result — replace with real API later
    setResults([
      {
        url: 'https://source.unsplash.com/600x400/?climate',
        caption: 'AI Suggestion: Climate change visual',
      },
      {
        url: 'https://source.unsplash.com/600x400/?water-crisis',
        caption: 'Water crisis illustration',
      },
    ])
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))

      // Simulated AI tags
      setTimeout(() => {
        setResults([
          {
            url: 'https://source.unsplash.com/600x400/?drought',
            caption: 'Suggested: Drought conditions',
          },
          {
            url: 'https://source.unsplash.com/600x400/?protest',
            caption: 'Suggested: Water shortage protest image',
          },
        ])
      }, 1000)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🖼️ AI-Powered Photo Selector</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Enter keyword (e.g. water crisis, protest, etc.)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={!keyword.trim()}>
            🔍 Search
          </Button>
          <Input type="file" accept="image/*" onChange={handleUpload} />
        </div>

        {image && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-1">Uploaded Image:</p>
            <img src={image} alt="Uploaded" className="max-w-sm rounded" />
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {results.map((img, i) => (
              <div key={i} className="rounded overflow-hidden border">
                <img src={img.url} alt="" className="w-full h-auto" />
                <div className="p-2 text-sm">{img.caption}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

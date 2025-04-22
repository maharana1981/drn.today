// components/MediaEditor.js
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function MediaEditor() {
  const [media, setMedia] = useState(null)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    setMedia(URL.createObjectURL(file))
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">📸 Image & Video Editor</h2>
        <Input type="file" accept="image/*,video/*" onChange={handleUpload} />
        {media && (
          <div className="mt-4">
            <video controls className="max-w-full" src={media} />
            <img className="max-w-full" src={media} alt="Uploaded preview" />
          </div>
        )}
        <Button>Enhance with AI (Coming Soon)</Button>
      </CardContent>
    </Card>
  )
}

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function SmartComposer() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabase.from('posts').insert({ title, content })
    setLoading(false)
    if (!error) {
      setTitle('')
      setContent('')
      alert('Post submitted!')
    }
  }

  const handleAISuggest = async () => {
    // This will later call AI assistant (mocked for now)
    setTitle('🧠 AI Suggested Headline: Breaking Innovation in AI')
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4 mb-6">
      <h2 className="text-xl font-bold">📝 Smart Post Composer</h2>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter headline" />
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your story..." rows={6} />
      <div className="flex gap-2">
        <Button onClick={handleAISuggest} variant="outline">✨ AI Suggest</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}

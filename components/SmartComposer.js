import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function SmartComposer() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabase.from('posts').insert({
      title,
      category,
      location,
      summary,
      content,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    })
    setLoading(false)
    if (!error) {
      setTitle('')
      setCategory('')
      setLocation('')
      setSummary('')
      setContent('')
      alert('✅ Post submitted successfully!')
    } else {
      alert('❌ Error submitting post!')
    }
  }

  const handleAISuggest = async () => {
    setTitle('🧠 AI Suggested Headline: Breakthrough in AI Technology')
    setSummary('An exciting new innovation in AI is poised to reshape how humans and machines interact globally.')
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4 mb-6">
      <h2 className="text-xl font-bold">📝 Smart Post Composer</h2>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter headline" />
      <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter category (e.g. technology, world)" />
      <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location (e.g. New York, India)" />
      <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Enter summary of the news..." rows={2} />
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your full story here..." rows={6} />
      <div className="flex gap-2">
        <Button onClick={handleAISuggest} variant="outline">✨ AI Suggest</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}

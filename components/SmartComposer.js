import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'

export default function SmartComposer() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !content) return alert('Title and content are required')
    setLoading(true)

    let mediaUrl = null
    if (mediaFile) {
      const fileExt = mediaFile.name.split('.').pop()
      const filePath = `posts/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, mediaFile)
      if (uploadError) {
        alert('Media upload failed')
        setLoading(false)
        return
      }
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath)
      mediaUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      category,
      location,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      media_url: mediaUrl,
    })

    setLoading(false)
    if (!error) {
      setTitle('')
      setContent('')
      setCategory('')
      setLocation('')
      setScheduledAt('')
      setMediaFile(null)
      alert('Post submitted!')
    } else {
      alert('❌ Error submitting post!')
    }
  }

  const handleAISuggest = () => {
    setTitle('🧠 AI Suggested Headline: Breaking Innovation in AI')
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4 mb-6">
      <h2 className="text-xl font-bold">📝 Smart Post Composer</h2>
      <Label>Headline</Label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter headline" />

      <Label>Category</Label>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {['world', 'politics', 'business', 'finance', 'technology', 'sports', 'entertainment', 'gaming', 'education', 'health', 'environment', 'weather', 'law-crime', 'innovation', 'culture-society', 'travel', 'religion', 'india', 'city-updates'].map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Location</Label>
      <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location (e.g. New York, India...)" />

      <Label>Content</Label>
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your story..." rows={6} />

      <Label>Upload Image/Video</Label>
      <Input type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files[0])} />

      <Label>Schedule Post</Label>
      <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />

      <div className="flex gap-2">
        <Button onClick={handleAISuggest} variant="outline">✨ AI Suggest</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}

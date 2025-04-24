import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function SmartComposer() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [scheduledAt, setScheduledAt] = useState('')
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, category, created_at, scheduled_at')
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentPosts(data || [])
    }
    fetchRecentPosts()
  }, [])

  const handleSubmit = async () => {
    if (!title || !content) return alert('Title and content are required')
    setLoading(true)

    let mediaUrl = null
    if (mediaFile) {
      if (!['image/', 'video/'].some(type => mediaFile.type.startsWith(type))) {
        alert('Only image or video files are allowed')
        setLoading(false)
        return
      }
      if (mediaFile.size > 10 * 1024 * 1024) {
        alert('Max file size is 10MB')
        setLoading(false)
        return
      }

      const fileExt = mediaFile.name.split('.').pop()
      const filePath = `posts/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, mediaFile)
      if (uploadError) {
        setStatus('failed')
        alert('Media upload failed')
        setLoading(false)
        return
      }
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath)
      mediaUrl = publicUrlData?.publicUrl
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('posts').insert({
      title,
      content,
      category,
      location,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      media_url: mediaUrl,
      user_id: user.id, // ✅ This line is required
    })    
    
    setLoading(false)
    if (!error) {
      setTitle('')
      setContent('')
      setCategory('')
      setLocation('')
      setScheduledAt('')
      setMediaFile(null)
      setStatus(scheduledAt ? 'scheduled' : 'published')
      alert('✅ Post submitted!')
    } else {
      setStatus('failed')
      console.error('Supabase insert error:', error)
      alert('❌ Error submitting post!')
    }
  }

  const handleAISuggest = () => {
    setTitle('🧠 AI Suggested Headline: Breaking Innovation in AI')
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4 mb-6">
      <h2 className="text-xl font-bold">📝 Smart Post Composer</h2>

      {status && (
        <Badge variant={status === 'published' ? 'default' : status === 'scheduled' ? 'secondary' : 'destructive'}>
          {status === 'published' ? 'Published' : status === 'scheduled' ? 'Scheduled' : 'Failed'}
        </Badge>
      )}

      <Label>Headline</Label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter headline" />

      <Label>Category</Label>
      <div className="relative">
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>Select category</option>
          {[ 'world', 'politics', 'business', 'finance', 'technology', 'sports', 'entertainment', 'gaming', 'education', 'health', 'environment', 'weather', 'law-crime', 'innovation', 'culture-society', 'travel', 'religion', 'india', 'city-updates' ].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <Label>Location</Label>
      <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location (e.g. New York, India...)" />

      <Label>Content</Label>
      <ReactQuill value={content} onChange={setContent} theme="snow" />

      <Label>Upload Image/Video</Label>
      <Input type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files[0])} />

      <Label>Schedule Post</Label>
      <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />

      <div className="flex gap-2">
        <Button onClick={handleAISuggest} variant="outline">✨ AI Suggest</Button>
        <Button onClick={() => setPreview(true)} variant="outline">👁️ Preview</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Publish'}
        </Button>
      </div>

      {preview && (
        <div className="bg-gray-100 rounded p-4 border border-gray-300">
          <h3 className="text-lg font-semibold mb-2">📋 Post Preview</h3>
          <h4 className="text-xl font-bold mb-2">{title}</h4>
          <p className="text-sm text-gray-500 mb-1">Category: {category}</p>
          <p className="text-sm text-gray-500 mb-3">Location: {location}</p>
          <div dangerouslySetInnerHTML={{ __html: content }} className="prose max-w-none" />
        </div>
      )}

      {recentPosts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">🕒 Recent Posts</h3>
          <ul className="space-y-2">
            {recentPosts.map(post => (
              <li key={post.id} className="border rounded p-3 bg-gray-50">
                <p className="font-semibold text-gray-800">{post.title}</p>
                <p className="text-sm text-gray-500">{post.category} | {post.scheduled_at ? '⏰ Scheduled' : '✅ Published'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

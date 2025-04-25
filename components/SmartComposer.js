// ⬇️ Your existing imports (unchanged)
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

// ⬇️ Start of component
export default function SmartComposer() {
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaUrls, setMediaUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [content, setContent] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentlyDeleted, setRecentlyDeleted] = useState(null)
  const [undoTimer, setUndoTimer] = useState(null)

  // ⬇️ Media upload handler (fixed size and types)
  const handleMediaUpload = async (file) => {
    if (!file) return
    setUploading(true)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type
        })
      })

      const { uploadUrl, fileUrl } = await res.json()

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })

      setMediaUrls(prev => [...prev, fileUrl])
    } catch (error) {
      alert('Upload failed')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  // ⬇️ Fetch recent posts
  useEffect(() => {
    fetchRecentPosts()
    const disableRightClick = (e) => e.preventDefault()
    document.addEventListener('contextmenu', disableRightClick)
    return () => document.removeEventListener('contextmenu', disableRightClick)
  }, [])

  const fetchRecentPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('id, title, category, created_at, scheduled_at, media_urls, user_id')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentPosts(data || [])
  }

  // ⬇️ Soft delete post (fixed posts/recentPosts mistake)
  const handleDeletePost = async (postId) => {
    const deletedPost = recentPosts.find(p => p.id === postId)
    setRecentlyDeleted(deletedPost)
    setRecentPosts(prev => prev.filter(p => p.id !== postId))

    const timer = setTimeout(async () => {
      await supabase.from('posts').update({ is_deleted: true }).eq('id', postId)
      setRecentlyDeleted(null)
    }, 5000)

    setUndoTimer(timer)
  }

  // ⬇️ Submit post
  const handleSubmit = async () => {
    if (!title || !content) return alert('Title and content are required')
    setLoading(true)

    const supabaseClient = createClientComponentClient()
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError) {
      alert('You must be logged in to post.')
      setLoading(false)
      return
    }

    const generateSlug = (text) =>
      text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const slug = generateSlug(title) + '-' + Date.now()

    const { error } = await supabaseClient.from('posts').insert({
      title,
      slug,
      content,
      category,
      location,
      schedule_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      media_urls: mediaUrls,
      status: scheduledAt ? 'scheduled' : 'published',
      user_id: user.id,
    })

    setLoading(false)
    if (error) {
      console.error('Supabase insert error:', error)
      setStatus('failed')
      alert('❌ Error submitting post!')
    } else {
      setTitle('')
      setContent('')
      setCategory('')
      setLocation('')
      setScheduledAt('')
      setMediaFiles([])
      setMediaUrls([])
      setStatus(scheduledAt ? 'scheduled' : 'published')
      alert('✅ Post submitted successfully!')
    }
  }

  const handleAISuggest = () => {
    setTitle('🧠 AI Suggested Headline: Breaking Innovation in AI')
  }

  // ⬇️ The actual return JSX (fixed delete button, undo, upload)
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

      <Label className="text-sm font-medium">Upload Images / Videos</Label>
      <Input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={async (e) => {
          const files = Array.from(e.target.files)

          for (const file of files) {
            if (!['image/', 'video/'].some(type => file.type.startsWith(type))) {
              alert(`Skipping ${file.name}: Invalid file type.`)
              continue
            }
            if (file.size > 30 * 1024 * 1024) {
              alert(`Skipping ${file.name}: File too large.`)
              continue
            }
            await handleMediaUpload(file)
          }
        }}
      />

      {mediaUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mediaUrls.map((url, index) => (
            <div key={index} className="rounded border p-3 bg-gray-100">
              {url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img src={url} alt="Uploaded" className="w-full rounded shadow" />
              ) : (
                <video src={url} controls className="w-full rounded shadow" />
              )}
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setMediaUrls(prev => prev.filter((_, i) => i !== index))
                }}
              >
                ❌ Remove
              </Button>
            </div>
          ))}
        </div>
      )}

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
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{post.title}</p>
                    <p className="text-sm text-gray-500">{post.category} | {post.scheduled_at ? '⏰ Scheduled' : '✅ Published'}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {recentlyDeleted && (
            <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 p-3 rounded shadow-lg z-50 flex items-center justify-between">
              <p className="text-sm text-yellow-800">
                Post “{recentlyDeleted.title}” deleted. <strong>Undo?</strong>
              </p>
              <Button
                onClick={() => {
                  if (!recentlyDeleted) return
                  clearTimeout(undoTimer)
                  setRecentPosts(prev => [recentlyDeleted, ...prev])
                  setRecentlyDeleted(null)
                  setUndoTimer(null)
                }}
                variant="outline"
                className="ml-4 text-yellow-700 border-yellow-400"
              >
                🔄 Undo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

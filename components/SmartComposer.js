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

export default function SmartComposer() {
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaUrls, setMediaUrls] = useState([])
  const [uploading, setUploading] = useState(false)
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
  const [deletedPost, setDeletedPost] = useState(null)
  const [undoTimer, setUndoTimer] = useState(null)


  useEffect(() => {
    const fetchRecentPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, category, created_at, scheduled_at, media_urls, user_id')
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentPosts(data || [])
    }
  
    fetchRecentPosts()
  
    const disableRightClick = (e) => e.preventDefault()
    document.addEventListener('contextmenu', disableRightClick)
    return () => document.removeEventListener('contextmenu', disableRightClick)
  }, [])  

  const handleDeletePost = (post) => {
    // 1. Temporarily remove from UI
    setRecentPosts(prev => prev.filter(p => p.id !== post.id))
    setDeletedPost(post)
  
    // 2. Start 8 second undo window
    const timer = setTimeout(async () => {
      try {
        // 🧹 Delete media
        if (Array.isArray(post.media_urls)) {
          for (const url of post.media_urls) {
            const filename = url.split('/').pop()
            await supabase.storage.from('media').remove([`posts/${filename}`])
          }
        }
  
        // 🧹 Delete comments
        await supabase.from('comments').delete().eq('post_id', post.id)
  
        // 🧹 Delete post
        const { error } = await supabase.from('posts').delete().eq('id', post.id)
        if (error) {
          console.error('Failed to permanently delete post:', error.message)
          alert('❌ Deletion failed.')
        }
  
        setDeletedPost(null)
        setUndoTimer(null)
        fetchRecentPosts() // ✅ refresh list
      } catch (err) {
        console.error('❌ Delete error:', err)
      }
    }, 8000)
  
    // 3. Save timer
    setUndoTimer(timer)
  }  
  
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
        alert('Max file size is 30MB')
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

    const supabaseClient = createClientComponentClient()

const {
  data: { user },
  error: userError,
} = await supabaseClient.auth.getUser()

if (userError) {
  console.error('Failed to get user:', userError)
  alert('You must be logged in to post.')
  return
}

// ✅ Generate slug from title
const generateSlug = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const slug = generateSlug(title) + '-' + Date.now()

// ✅ Insert post with slug
const { error } = await supabaseClient.from('posts').insert({
  title,
  slug, // ✅ Add this line
  content,
  category,
  location,
  schedule_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
  media_urls: mediaUrls,
  status: scheduledAt ? 'scheduled' : 'published',
  user_id: user.id,
})

if (error) {
  console.error('Supabase insert error:', error)
  alert('❌ Error submitting post!')
}

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

      <Label className="text-sm font-medium">Upload Images / Videos</Label>

<Input
  type="file"
  accept="image/*,video/*"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const isValid = (file.size <= 10 * 1024 * 1024) &&
                      (file.type.startsWith('image') || file.type.startsWith('video'))
      if (!isValid) alert(`Skipping ${file.name}: Invalid type or too large`)
      return isValid
    })

    setMediaFiles(prev => [...prev, ...validFiles])

    validFiles.forEach(async (file) => {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      })

      const { uploadUrl, fileUrl } = await res.json()

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })

      setMediaUrls(prev => [...prev, fileUrl])
    })
  }}
/>
{mediaUrls.length > 0 && (
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {mediaUrls.map((url, index) => {
      const file = mediaFiles[index]
      const type = file?.type || ''

      return (
        <div key={index} className="rounded border p-3 bg-gray-100">
          {type.startsWith('image') ? (
            <img
              src={url}
              alt="Uploaded"
              className="w-full rounded shadow"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: 'none' }}
            />
          ) : type.startsWith('video') ? (
            <video
              src={url}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full rounded shadow"
              style={{ userSelect: 'none' }}
            />
          ) : null}

          <Button
            variant="destructive"
            size="sm"
            className="mt-2"
            onClick={() => {
              setMediaFiles(prev => prev.filter((_, i) => i !== index))
              setMediaUrls(prev => prev.filter((_, i) => i !== index))
            }}
          >
            ❌ Remove
          </Button>
        </div>
      )
    })}
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
                  onClick={() => handleDeletePost(post)}
                >
                  🗑️ Delete
                </Button>
              </div>
            </li>            
            ))}
          </ul>
          {deletedPost && (
  <div className="mt-4 bg-yellow-100 border border-yellow-400 p-3 rounded flex items-center justify-between">
    <p className="text-sm text-yellow-800">
      Post “{deletedPost.title}” deleted. <strong>Undo?</strong>
    </p>
    <Button
      onClick={() => {
        if (!deletedPost) return
        clearTimeout(undoTimer)
        setRecentPosts(prev => [deletedPost, ...prev])
        setDeletedPost(null)
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

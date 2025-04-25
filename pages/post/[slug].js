// This file is for post detail view. You mentioned Newsroom dashboard, so to implement the delete feature, this logic will be added in the Newsroom posts list or editor view.
// For now, this file remains the post viewer. Let's add a helper function here if the user is authorized (optional):

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Head from 'next/head'

export default function PostPage() {
  const router = useRouter()
  const slug = decodeURIComponent((router.query.slug || '').toString().toLowerCase())
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        const { data } = await supabase.from('posts').select('*').eq('slug', slug).single()
        if (data) {
          await supabase.from('posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id)
          setPost({ ...data, views: (data.views || 0) + 1 })
        }
      }
      fetchPost()
    }
  }, [slug])

  useEffect(() => {
    if (!slug) return
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('slug', slug)
        .order('created_at', { ascending: false })
      if (data) setComments(data)
    }
    fetchComments()

    const channel = supabase
      .channel('realtime-comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
        if (payload.new.slug === slug) {
          setComments((prev) => [payload.new, ...prev])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [slug])

  const handleDeletePost = async () => {
    if (!post || post.user_id !== userId) return alert('Unauthorized')
    if (!confirm('⚠️ Are you sure you want to permanently delete this post and all related content?')) return

    // Delete related comments first (optional)
    await supabase.from('comments').delete().eq('post_id', post.id)

    // Delete the post
    const { error } = await supabase.from('posts').delete().eq('id', post.id)
    if (!error) {
      alert('✅ Post deleted successfully!')
      router.push('/')
    } else {
      alert('❌ Failed to delete post.')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !post?.id) return

    setLoading(true)
    await supabase.from('comments').insert({
      post_id: post.id,
      slug,
      content: newComment,
      author_name: 'Anonymous',
      is_verified: false,
    })
    setNewComment('')
    setLoading(false)
  }

  if (!post) return <div className="p-8 text-white text-center">Loading...</div>

  const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls].filter(Boolean)

  return (
    <>
      <Head>
        <title>{post?.title} | DRN.today</title>
        <meta name="description" content={post?.summary || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post?.title || ''} />
        <meta property="og:description" content={post?.summary || ''} />
        <meta property="og:image" content={mediaUrls[0] || ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title || ''} />
        <meta name="twitter:description" content={post?.summary || ''} />
        <meta name="twitter:image" content={mediaUrls[0] || ''} />
      </Head>

      <main className="max-w-3xl mx-auto p-6 text-white">
        <Link href="/" className="text-blue-400 hover:underline">← Back to Home</Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
          {userId === post.user_id && (
            <button onClick={handleDeletePost} className="text-red-500 hover:text-red-700 text-sm">🗑️ Delete Post</button>
          )}
        </div>
        <p className="text-gray-400 text-sm">{post.location} · {post.category} · {new Date(post.created_at).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mt-1">👁️ {post.views || 0} views</p>

        {mediaUrls.length > 0 && (
          <div className="mt-6 space-y-4">
            {mediaUrls.map((url, i) =>
              url.endsWith('.mp4') ? (
                <video key={i} src={url} controls className="w-full rounded-lg shadow" />
              ) : (
                <img key={i} src={url} alt={`media-${i}`} className="w-full rounded-lg shadow" />
              )
            )}
          </div>
        )}

        <div
          className="mt-6 text-lg leading-relaxed text-gray-100 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-2">Leave a Comment</h2>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
              rows={3}
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !newComment.trim()}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div>
            <h3 className="text-lg font-semibold mb-3">Comments</h3>
            {comments.length === 0 && <p className="text-gray-400">No comments yet.</p>}
            {comments.map((c) => (
              <div key={c.id} className="mb-4 border-b border-gray-700 pb-2">
                <p className="text-sm text-blue-400 font-semibold">{c.author_name || 'Anonymous'}</p>
                <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{c.content}</p>
                <p className="text-gray-500 text-xs mt-1">{new Date(c.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

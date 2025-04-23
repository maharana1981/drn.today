// pages/post/[slug].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Head from 'next/head'

export default function PostPage() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch post
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

  // Fetch comments
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

    // Realtime subscription
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

  // Handle submit
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

  return (
    <>
      <Head>
        <title>{post?.title} | DRN.today</title>
        <meta name="description" content={post?.summary || ''} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={post?.title || ''} />
        <meta property="og:description" content={post?.summary || ''} />
        <meta property="og:image" content={post?.thumbnail_url || post?.video_url || ''} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title || ''} />
        <meta name="twitter:description" content={post?.summary || ''} />
        <meta name="twitter:image" content={post?.thumbnail_url || post?.video_url || ''} />
      </Head>

      <main className="max-w-3xl mx-auto p-6 text-white">
        <Link href="/" className="text-blue-400 hover:underline">← Back to Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
        <p className="text-gray-400 text-sm">{post.location} · {post.category} · {new Date(post.created_at).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500 mt-1">👁️ {post.views || 0} views</p>

        <div className="mt-6 text-lg leading-relaxed text-gray-100 whitespace-pre-wrap">
          {post.content || post.summary}
        </div>

        {post.video_url && (
          <div className="mt-6">
            <video src={post.video_url} controls className="w-full rounded" />
          </div>
        )}

        {/* Comment input */}
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

          {/* Comments list */}
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

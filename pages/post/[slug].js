// pages/post/[slug].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PostPage() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        const { data } = await supabase.from('posts').select('*').eq('slug', slug).single()
        setPost(data)
      }
      fetchPost()
    }
  }, [slug])

  if (!post) return <div className="p-8 text-white text-center">Loading...</div>

  return (
    <main className="max-w-3xl mx-auto p-6 text-white">
      <Link href="/" className="text-blue-400 hover:underline">← Back to Home</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
      <p className="text-gray-400 text-sm">{post.location} · {post.category} · {new Date(post.created_at).toLocaleDateString()}</p>
      <div className="mt-6 text-lg leading-relaxed text-gray-100 whitespace-pre-wrap">
        {post.content || post.summary}
      </div>

      {post.video_url && (
        <div className="mt-6">
          <video src={post.video_url} controls className="w-full rounded" />
        </div>
      )}
    </main>
  )
}

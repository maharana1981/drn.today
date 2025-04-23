// components/TopStories.js
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function TopStories() {
  const [topPosts, setTopPosts] = useState([])

  useEffect(() => {
    const fetchTopPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('views', { ascending: false })
        .limit(3)
      setTopPosts(data || [])
    }
    fetchTopPosts()
  }, [])

  if (!topPosts.length) return null

  return (
    <div className="my-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">🔥 Top Stories</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {topPosts.map((post) => (
          <Link key={post.id} href={`/post/${post.slug}`}>
            <div className="bg-slate-900 p-4 rounded-lg shadow hover:shadow-blue-500/30 transition-all">
              <h3 className="text-xl font-semibold text-blue-300 mb-2">{post.title}</h3>
              <p className="text-gray-400 text-sm">{post.location} · {post.category}</p>
              <p className="text-gray-200 mt-2 line-clamp-3">{post.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

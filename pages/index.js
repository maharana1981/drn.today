import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PublicHome() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      if (data) setPosts(data)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-center">DRN.today – Global News, Real-Time</h1>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {['Trending', 'World', 'Politics', 'Business', 'Finance', 'Technology', 'Sports', 'Entertainment', 'Gaming', 'Education', 'Health', 'Environment', 'Weather', 'Law & Crime', 'Innovation', 'Culture & Society', 'Travel', 'Religion', 'India', 'City Updates']
].map((cat) => (
          <Badge key={cat} variant="outline" className="cursor-pointer text-white border-white">
            {cat}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-900 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              <CardContent className="p-4">
                <Link href={`/post/${post.slug}`}>
                  <h2 className="text-xl font-semibold text-blue-300 hover:underline">{post.title}</h2>
                </Link>
                <p className="text-sm text-gray-400 mt-1">{post.location} · {post.category}</p>
                <p className="text-gray-200 text-sm mt-2 line-clamp-3">{post.summary}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
// trigger deploy

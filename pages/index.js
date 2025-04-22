import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PublicHome() {
  const [posts, setPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLocation, setActiveLocation] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      if (data) setPosts(data)
    }
    fetchPosts()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchCategory = activeCategory === 'all' || post.category?.toLowerCase() === activeCategory
    const matchLocation = activeLocation === 'all' || post.location?.toLowerCase().includes(activeLocation)
    const matchSearch = post.title?.toLowerCase().includes(search.toLowerCase()) || post.summary?.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchLocation && matchSearch
  })

  const locations = ['all', 'new york', 'london', 'delhi', 'tokyo', 'global']

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-center">DRN.today – Global News, Real-Time</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl px-4 py-2 rounded text-black"
        />
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {[
          { label: 'All', value: 'all' },
          { label: 'Trending', value: 'trending' },
          { label: 'World', value: 'world' },
          { label: 'Politics', value: 'politics' },
          { label: 'Business', value: 'business' },
          { label: 'Finance', value: 'finance' },
          { label: 'Technology', value: 'technology' },
          { label: 'Sports', value: 'sports' },
          { label: 'Entertainment', value: 'entertainment' },
          { label: 'Gaming', value: 'gaming' },
          { label: 'Education', value: 'education' },
          { label: 'Health', value: 'health' },
          { label: 'Environment', value: 'environment' },
          { label: 'Weather', value: 'weather' },
          { label: 'Law & Crime', value: 'law-crime' },
          { label: 'Innovation', value: 'innovation' },
          { label: 'Culture & Society', value: 'culture-society' },
          { label: 'Travel', value: 'travel' },
          { label: 'Religion', value: 'religion' },
          { label: 'India', value: 'india' },
          { label: 'City Updates', value: 'city-updates' }
        ].map(({ label, value }) => (
          <Badge
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`cursor-pointer border-white px-3 py-1 ${activeCategory === value ? 'bg-white text-black' : 'text-white'}`}
          >
            {label}
          </Badge>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {locations.map((loc) => (
          <Badge
            key={loc}
            onClick={() => setActiveLocation(loc)}
            className={`cursor-pointer border-white px-3 py-1 capitalize ${activeLocation === loc ? 'bg-white text-black' : 'text-white'}`}
          >
            {loc}
          </Badge>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-400">No posts available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
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

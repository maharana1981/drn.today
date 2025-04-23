import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'
import TopStories from '@/components/TopStories'

export default function PublicHome() {
  const [posts, setPosts] = useState([])
  const [breakingNews, setBreakingNews] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLocation, setActiveLocation] = useState('all')
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState('latest')
  const [page, setPage] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerRef = useRef()
  const POSTS_PER_PAGE = 6

  const fetchPosts = useCallback(async (reset = false) => {
    setLoadingMore(true)
    const from = reset ? 0 : page * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order(sortMode === 'trending' ? 'views' : 'created_at', { ascending: false })
      .range(from, to)

    if (data) {
      setPosts(prev => reset ? data : [...prev, ...data])
      if (reset) {
        setBreakingNews(data.filter(p => p.breaking))
      }
    }
    setLoadingMore(false)
  }, [page, sortMode])

  useEffect(() => {
    setPage(0)
    fetchPosts(true)
  }, [activeCategory, activeLocation, search, sortMode])

  useEffect(() => {
    if (!observerRef.current) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1)
      }
    }, { threshold: 1 })
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [observerRef.current])

  useEffect(() => {
    if (page > 0) fetchPosts()
  }, [page])

  const filteredPosts = posts.filter(post => {
    const matchCategory = activeCategory === 'all' || post.category?.toLowerCase() === activeCategory
    const matchLocation = activeLocation === 'all' || post.location?.toLowerCase().includes(activeLocation)
    const matchSearch = post.title?.toLowerCase().includes(search.toLowerCase()) || post.summary?.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchLocation && matchSearch
  })

  const locations = ['all', 'new york', 'london', 'delhi', 'tokyo', 'global']

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4 rounded mb-4 overflow-hidden whitespace-nowrap animate-marquee">
          <span className="font-bold mr-4">🚨 Breaking:</span>
          {breakingNews.map((post) => (
            <span key={post.id} className="mx-4">
              <Link href={`/post/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </span>
          ))}
        </div>
      )}

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

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setSortMode('latest')} className={`px-4 py-2 rounded ${sortMode === 'latest' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>🕒 Latest</button>
        <button onClick={() => setSortMode('trending')} className={`px-4 py-2 rounded ${sortMode === 'trending' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>🔥 Trending</button>
      </div>

      <div className="mb-4 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        {[{ label: 'All', value: 'all' }, { label: 'Trending', value: 'trending' }, { label: 'World', value: 'world' }, { label: 'Politics', value: 'politics' }, { label: 'Business', value: 'business' }, { label: 'Finance', value: 'finance' }, { label: 'Technology', value: 'technology' }, { label: 'Sports', value: 'sports' }, { label: 'Entertainment', value: 'entertainment' }, { label: 'Gaming', value: 'gaming' }, { label: 'Education', value: 'education' }, { label: 'Health', value: 'health' }, { label: 'Environment', value: 'environment' }, { label: 'Weather', value: 'weather' }, { label: 'Law & Crime', value: 'law-crime' }, { label: 'Innovation', value: 'innovation' }, { label: 'Culture & Society', value: 'culture-society' }, { label: 'Travel', value: 'travel' }, { label: 'Religion', value: 'religion' }, { label: 'India', value: 'india' }, { label: 'City Updates', value: 'city-updates' }].map(({ label, value }) => (
          <Badge
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`cursor-pointer border-white px-3 py-1 mx-1 inline-block ${activeCategory === value ? 'bg-white text-black' : 'text-white'}`}
          >
            {label}
          </Badge>
        ))}
      </div>

      <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        {locations.map((loc) => (
          <Badge
            key={loc}
            onClick={() => setActiveLocation(loc)}
            className={`cursor-pointer border-white px-3 py-1 mx-1 inline-block capitalize ${activeLocation === loc ? 'bg-white text-black' : 'text-white'}`}
          >
            {loc}
          </Badge>
        ))}
      </div>

      <TopStories />

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
              {post.thumbnail_url && (
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-t"
                />
              )}
              {!post.thumbnail_url && post.video_url && (
                <video
                  src={post.video_url}
                  controls
                  className="w-full h-40 object-cover rounded-t"
                />
              )}
              <CardContent className="p-4">
                <Link href={`/post/${post.slug}`}>
                  <h2 className="text-xl font-semibold text-blue-300 hover:underline">{post.title}</h2>
                </Link>
                <p className="text-sm text-gray-400 mt-1">{post.location} · {post.category}</p>
                <p className="text-sm text-gray-500">👁️ {post.views || 0} views</p>
                <p className="text-gray-200 text-sm mt-2 line-clamp-3">{post.summary}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div ref={observerRef} className="py-10 text-center">
        {loadingMore && <p className="text-gray-400">Loading more...</p>}
      </div>
    </div>
  )
}

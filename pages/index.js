import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'
import TopStories from '@/components/TopStories'

export default function PublicHome() {
  const [posts, setPosts] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [breakingNews, setBreakingNews] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLocation, setActiveLocation] = useState('all')
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState('latest')
  const [page, setPage] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [commentInputs, setCommentInputs] = useState({})
  const observerRef = useRef()
  const POSTS_PER_PAGE = 6

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Your browser does not support voice search.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setSearch(transcript)
    }

    recognition.start()
  }

  const fetchPosts = useCallback(async (reset = false) => {
    setLoadingMore(true)
    const from = reset ? 0 : page * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1
  
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order(sortMode === 'trending' ? 'views' : 'created_at', { ascending: false })
      .range(from, to)
  
    // fetch all reactions for the current page of posts
    const postIds = postsData.map(p => p.id)

const { data: reactions, error } = await supabase
  .from('reactions')
  .select('post_id, type')
  .in('post_id', postIds)

if (error) {
  console.error('❌ Error fetching reactions:', error)
}

const reactionMap = {}

reactions?.forEach(({ post_id, type }) => {
  if (!reactionMap[post_id]) {
    reactionMap[post_id] = { like: 0, dislike: 0, save: 0 }
  }
  if (reactionMap[post_id][type] !== undefined) {
    reactionMap[post_id][type] += 1
  }
})

  
    // combine reactions with posts
    const postsWithReactions = postsData.map(post => {
      const like = reactions?.find(r => r.post_id === post.id && r.type === 'like')?.count || 0
      const dislike = reactions?.find(r => r.post_id === post.id && r.type === 'dislike')?.count || 0
      return { ...post, reactions: { like, dislike } }
    })
  
    setPosts(prev => reset ? postsWithReactions : [...prev, ...postsWithReactions])
  
    if (reset) {
      setBreakingNews(postsWithReactions.filter(p => p.breaking))
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

  useEffect(() => {
    const savedLocation = localStorage.getItem('preferredLocation')
    if (savedLocation) {
      setActiveLocation(savedLocation)
    }
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]')
    setBookmarks(savedBookmarks)
  }, [])

  const toggleBookmark = (postId) => {
    let updated = []
    if (bookmarks.includes(postId)) {
      updated = bookmarks.filter(id => id !== postId)
    } else {
      updated = [...bookmarks, postId]
    }
    setBookmarks(updated)
    localStorage.setItem('bookmarkedPosts', JSON.stringify(updated))
  }

  const handleReaction = async (postId, type) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Please login to react')
      return
    }

    await supabase.from('reactions').upsert({
      post_id: postId,
      type,
      user_id: user.id
    }, {
      onConflict: 'post_id, user_id, type'
    })

    alert(type === 'like' ? 'Liked!' : type === 'dislike' ? 'Disliked!' : 'Saved!')
  }

  const handleCommentChange = (postId, text) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }))
  }

  const submitComment = async (postId) => {
    const content = commentInputs[postId]?.trim()
    if (!content) return

    await supabase.from('comments').insert({ post_id: postId, content })
    alert('Comment submitted!')
    setCommentInputs(prev => ({ ...prev, [postId]: '' }))
  }

  const filteredPosts = posts.filter(post => {
    const matchCategory = activeCategory === 'all' || post.category?.toLowerCase() === activeCategory
    const matchLocation = activeLocation === 'all' || post.location?.toLowerCase().includes(activeLocation)
    const matchSearch = post.title?.toLowerCase().includes(search.toLowerCase()) || post.summary?.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchLocation && matchSearch
  })

  const translate = (text) => {
    const lang = navigator.language || 'en'
    return lang.startsWith('en') ? text : text
  }

  const toggleTheme = () => setDarkMode(!darkMode)

  const handleLocationSelect = (loc) => {
    setActiveLocation(loc)
    localStorage.setItem('preferredLocation', loc)
  }

  const locations = ['all', 'new york', 'london', 'delhi', 'tokyo', 'global']

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} px-4 py-6`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">DRN.today – Global News, Real-Time</h1>
        <button onClick={toggleTheme} className="border px-3 py-1 rounded text-sm">
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4 rounded mb-4 overflow-hidden whitespace-nowrap animate-marquee">
          <span className="font-bold mr-4">🚨 Breaking:</span>
          {breakingNews.map((post) => (
            <span key={post.id} className="mx-4">
              <Link href={`/post/${post.slug}`} key={post.id} className="block bg-[#0f172a] text-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 w-full sm:w-[320px]">
  {/* Show media preview if available */}
  {post.media_urls?.[0] && (
    post.media_urls[0].endsWith('.mp4') ? (
      <video
        src={post.media_urls[0]}
        controls
        className="w-full h-48 object-cover rounded mb-3"
      />
    ) : (
      <img
        src={post.media_urls[0]}
        alt="media"
        className="w-full h-48 object-cover rounded mb-3"
      />
    )
  )}

  <h2 className="text-lg font-bold mb-1">{post.title}</h2>
  <p className="text-sm text-gray-400 mb-1">{post.location} · {post.category}</p>
  <p
    className="text-sm text-gray-300"
    dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) + '...' }}
  />
</Link>
            </span>
          ))}
        </div>
      )}

<div className="mb-4 flex justify-center items-center gap-2">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl px-4 py-2 rounded text-black"
        />
        <button
          onClick={startVoiceSearch}
          className={`px-3 py-2 rounded ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
          title="Voice Search"
        >
          🎤
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setSortMode('latest')} className={`px-4 py-2 rounded ${sortMode === 'latest' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>🕒 Latest</button>
        <button onClick={() => setSortMode('trending')} className={`px-4 py-2 rounded ${sortMode === 'trending' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>🔥 Trending</button>
      </div>

      <div className="mb-4 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        {[{ label: 'All', value: 'all' }, { label: 'Trending', value: 'trending' }, { label: 'World', value: 'world' }, { label: 'Politics', value: 'politics' }, { label: 'Business', value: 'business' }, { label: 'Finance', value: 'finance' }, { label: 'Technology', value: 'technology' }, { label: 'Sports', value: 'sports' }, { label: 'Entertainment', value: 'entertainment' }, { label: 'Gaming', value: 'gaming' }, { label: 'Education', value: 'education' }, { label: 'Health', value: 'health' }, { label: 'Environment', value: 'environment' }, { label: 'Weather', value: 'weather' }, { label: 'Law & Crime', value: 'law-crime' }, { label: 'Innovation', value: 'innovation' }, { label: 'Culture & Society', value: 'culture-society' }, { label: 'Travel', value: 'travel' }, { label: 'Religion', value: 'religion' }, { label: 'India', value: 'india' }, { label: 'City Updates', value: 'city-updates' }].map(({ label, value }) => (
          <Badge
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`cursor-pointer border px-3 py-1 mx-1 inline-block ${activeCategory === value ? 'bg-black text-white' : 'text-black'}`}
          >
            {label}
          </Badge>
        ))}
      </div>

      <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        {locations.map((loc) => (
          <Badge
            key={loc}
            onClick={() => handleLocationSelect(loc)}
            className={`cursor-pointer border px-3 py-1 mx-1 inline-block capitalize ${activeLocation === loc ? 'bg-black text-white' : 'text-black'}`}
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
            <Card className={`hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-all`}>
              {post.thumbnail_url && (
                <img src={post.thumbnail_url} alt={post.title} className="w-full h-40 object-cover rounded-t" />
              )}
              {!post.thumbnail_url && post.video_url && (
                <video src={post.video_url} controls className="w-full h-40 object-cover rounded-t" />
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <Link href={`/post/${post.slug}`}>
                    <h2 className="text-xl font-semibold hover:underline">{translate(post.title)}</h2>
                  </Link>
                  <button onClick={() => toggleBookmark(post.id)} className="text-yellow-500 text-sm ml-2">
                    {bookmarks.includes(post.id) ? '🔖 Saved' : '➕ Save'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{post.location} · {post.category}</p>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
  <button onClick={() => handleReaction(post.id, 'like')}>
    ❤️ Like ({post.reactions?.like || 0})
  </button>
  <button onClick={() => handleReaction(post.id, 'dislike')}>
    👎 Dislike ({post.reactions?.dislike || 0})
  </button>
  <button onClick={() => toggleBookmark(post.id)}>
    {bookmarks.includes(post.id) ? '🔖 Saved' : '➕ Save'}
  </button>
</div>

                <div className="text-xs text-green-600 mt-1">
                  {post.views > 1000 && '#trending'} {post.exclusive && '#exclusive'}
                </div>
                <div
                  className="text-gray-700 text-sm mt-2 line-clamp-3 hover:line-clamp-none transition-all duration-200"
                  title="Hover to expand full summary"
                >
                  {translate(post.summary)}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 text-sm rounded border mt-2 text-black"
                  />
                  <button
                    onClick={() => submitComment(post.id)}
                    className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    
                    Submit Comment
                  </button>
                </div>
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

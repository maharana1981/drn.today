import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase' // correct import
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Sparkles, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setPosts(data)
    }

    fetchPosts()
  }, [])

  return (
    <>
      <Head>
        <title>DRN.today – Dynamic Reality Network</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-gray-800">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white shadow z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-wide text-blue-700">DRN.today</h1>
            <div className="flex gap-2 items-center">
              <Input placeholder="Search news..." className="w-64" />
              <Button><Search size={16} /></Button>
            </div>
          </div>
        </header>

        {/* Animated AI Headline */}
        <section className="text-center py-12">
          <motion.h2
            className="text-4xl font-extrabold text-blue-800 mb-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Sparkles /> Discover Breaking News, Powered by AI
          </motion.h2>
          <p className="text-lg text-gray-600">Live stories, curated by AI — share the truth, shape the world.</p>
        </section>

        {/* Posts Grid */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pb-20">
          {posts.map((post, i) => (
            <motion.div
              key={post.id || i}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-md hover:shadow-xl transition rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.summary || "No summary available."}</p>
                  <Button variant="outline" size="sm">Read more</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </main>
      </div>
    </>
  )
}

import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import SmartComposer from '@/components/SmartComposer'
import AIResearchAssistant from '@/components/AIResearchAssistant' // ✅ NEW

// 🚧 TEMP: Disabled auth check so dashboard is publicly viewable for development

export default function Dashboard() {
  return (
    <DashboardLayout>
      <motion.h1
        className="text-3xl font-bold text-blue-700 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        DRN.today Dashboard
      </motion.h1>

      {/* ✅ Composer + AI Research */}
      <SmartComposer />
      <AIResearchAssistant />

      {/* 📦 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">📝 Smart Post Composer</h2>
            <p>Create rich text, image & video posts with AI-assisted suggestions.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">🧠 AI Research Assistant</h2>
            <p>Fact check, auto-translate, and generate summaries using AI.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">📸 Image + Video Editor</h2>
            <p>Edit, enhance, and auto-caption visual media with smart tools.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">📅 Content Calendar</h2>
            <p>Plan posts, track deadlines, and get smart AI prompts.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">📈 Performance Insights</h2>
            <p>See your post views, shares, and headline test results.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">🤝 Collaboration Room</h2>
            <p>Chat, co-edit stories, and connect with other verified journalists.</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔓 Sign Out */}
      <div className="mt-10">
        <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
      </div

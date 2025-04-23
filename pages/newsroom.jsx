import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import SmartComposer from '@/components/SmartComposer'
import AIResearchAssistant from '@/components/AIResearchAssistant'
import AIFactChecker from '@/components/AIFactChecker'
import AIHeadlineOptimizer from '@/components/AIHeadlineOptimizer'
import AutoTranslator from '@/components/AutoTranslator'
import VoiceToArticle from '@/components/VoiceToArticle'
import PhotoSelector from '@/components/PhotoSelector'
import BreakingNewsTicker from '@/components/BreakingNewsTicker'
import PressRewriter from '@/components/PressRewriter'
import SchedulingAssistant from '@/components/SchedulingAssistant'
import EarningsDashboard from '@/components/EarningsDashboard'
import MediaEditor from '@/components/MediaEditor'
import ContentCalendar from '@/components/ContentCalendar'
import AnalyticsPanel from '@/components/AnalyticsPanel'
import CollaborationRoom from '@/components/CollaborationRoom'
import TipInbox from '@/components/TipInbox'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Pencil, BrainCog, Translate, Mic, Calendar, Camera } from 'lucide-react'

export default function Newsroom() {
  const [fabOpen, setFabOpen] = useState(false)

  const tools = [
    { icon: <Pencil size={18} />, component: <SmartComposer /> },
    { icon: <BrainCog size={18} />, component: <AIResearchAssistant /> },
    { icon: <Translate size={18} />, component: <AutoTranslator /> },
    { icon: <Mic size={18} />, component: <VoiceToArticle /> },
    { icon: <Camera size={18} />, component: <PhotoSelector /> },
    { icon: <Calendar size={18} />, component: <ContentCalendar /> },
  ]

  return (
    <DashboardLayout>
      <h1 className='text-2xl font-bold text-blue-700 mb-6'>DRN.today Newsroom</h1>

      <BreakingNewsTicker />
      <EarningsDashboard />
      <AnalyticsPanel />
      <CollaborationRoom />
      <TipInbox />
      <AIFactChecker />
      <AIHeadlineOptimizer />
      <PressRewriter />
      <SchedulingAssistant />
      <MediaEditor />

      <AnimatePresence>
        {fabOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-6 flex flex-col items-end gap-4 z-40"
          >
            {tools.map(({ icon, component }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg w-80"
              >
                <div className="flex items-center gap-2 mb-2">{icon}<span className="text-sm font-medium">Tool</span></div>
                {component}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setFabOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {fabOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </DashboardLayout>
  )
}

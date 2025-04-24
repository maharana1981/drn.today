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
import { useState } from 'react'
import Image from 'next/image'

const tools = [
  { name: 'Smart Composer', component: <SmartComposer /> },
  { name: 'Research Assistant', component: <AIResearchAssistant /> },
  { name: 'Fact Checker', component: <AIFactChecker /> },
  { name: 'Headline Optimizer', component: <AIHeadlineOptimizer /> },
  { name: 'Auto Translator', component: <AutoTranslator /> },
  { name: 'Voice to Article', component: <VoiceToArticle /> },
  { name: 'Photo Selector', component: <PhotoSelector /> },
  { name: 'Breaking News Ticker', component: <BreakingNewsTicker /> },
  { name: 'Press Rewriter', component: <PressRewriter /> },
  { name: 'Scheduling Assistant', component: <SchedulingAssistant /> },
  { name: 'Earnings Dashboard', component: <EarningsDashboard /> },
  { name: 'Media Editor', component: <MediaEditor /> },
  { name: 'Content Calendar', component: <ContentCalendar /> },
  { name: 'Analytics Panel', component: <AnalyticsPanel /> },
  { name: 'Collaboration Room', component: <CollaborationRoom /> },
  { name: 'Tip Inbox', component: <TipInbox /> },
]

export default function Newsroom() {
  const [selectedTool, setSelectedTool] = useState(tools[0])

  return (
    <DashboardLayout>
      <div className="flex w-full">
        {/* Sidebar with Tools */}
        <aside className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-6">
            <Image
              src="https://via.placeholder.com/40"
              alt="Profile"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <p className="text-sm">Welcome,</p>
              <p className="font-semibold">Journalist</p>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4">Tools</h2>
          {tools.map(tool => (
            <button
              key={tool.name}
              onClick={() => setSelectedTool(tool)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${selectedTool.name === tool.name ? 'bg-gray-800 font-bold' : ''}`}
            >
              {tool.name}
            </button>
          ))}
        </aside>

        {/* Selected Tool Display */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-blue-700 mb-4">{selectedTool.name}</h1>
          <div className="bg-white rounded shadow p-4">
            {selectedTool.component}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}

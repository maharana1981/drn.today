import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

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
import QuoteExtractor from '@/components/QuoteExtractor'
import TimelineGenerator from '@/components/TimelineGenerator'
import HashtagRecommender from '@/components/HashtagRecommender'
import ArchiveSearch from '@/components/ArchiveSearch'
import InterviewScheduler from '@/components/InterviewScheduler'
import SentimentScanner from '@/components/SentimentScanner'
import FactUpdateTracker from '@/components/FactUpdateTracker'
import OutreachAssistant from '@/components/OutreachAssistant'
import TaskManager from '@/components/TaskManager'
import Image from 'next/image'

const groupedTools = [
  {
    category: 'Content Creation',
    tools: [
      { name: 'Smart Composer', component: <SmartComposer /> },
      { name: 'Research Assistant', component: <AIResearchAssistant /> },
      { name: 'Fact Checker', component: <AIFactChecker /> },
      { name: 'Headline Optimizer', component: <AIHeadlineOptimizer /> },
      { name: 'Press Rewriter', component: <PressRewriter /> },
      { name: 'Quote Extractor', component: <QuoteExtractor /> },
      { name: 'Timeline Generator', component: <TimelineGenerator /> },
      { name: 'Hashtag Recommender', component: <HashtagRecommender /> }
    ]
  },
  {
    category: 'Media & Translation',
    tools: [
      { name: 'Auto Translator', component: <AutoTranslator /> },
      { name: 'Voice to Article', component: <VoiceToArticle /> },
      { name: 'Photo Selector', component: <PhotoSelector /> },
      { name: 'Media Editor', component: <MediaEditor /> }
    ]
  },
  {
    category: 'Scheduling & Monitoring',
    tools: [
      { name: 'Breaking News Ticker', component: <BreakingNewsTicker /> },
      { name: 'Scheduling Assistant', component: <SchedulingAssistant /> },
      { name: 'Interview Scheduler', component: <InterviewScheduler /> },
      { name: 'Fact Update Tracker', component: <FactUpdateTracker /> }
    ]
  },
  {
    category: 'Insights & Engagement',
    tools: [
      { name: 'Earnings Dashboard', component: <EarningsDashboard /> },
      { name: 'Content Calendar', component: <ContentCalendar /> },
      { name: 'Analytics Panel', component: <AnalyticsPanel /> },
      { name: 'Collaboration Room', component: <CollaborationRoom /> },
      { name: 'Tip Inbox', component: <TipInbox /> },
      { name: 'Public Sentiment Scanner', component: <SentimentScanner /> },
      { name: 'Press Outreach Assistant', component: <OutreachAssistant /> },
      { name: 'Archive Search Tool', component: <ArchiveSearch /> }
    ]
  },
  {
    category: 'Productivity Tools',
    tools: [
      { name: 'Task Manager', component: <TaskManager /> }
    ]
  }
]

export default function Newsroom() {
  const [selectedTool, setSelectedTool] = useState(groupedTools[0].tools[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [sessionChecked, setSessionChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
      } else {
        setLoggedIn(true)
      }
      setSessionChecked(true)
    }

    checkSession()
  }, [router])

  if (!sessionChecked) {
    return <div className="p-8 text-white text-center">Checking access...</div>
  }

  if (!loggedIn) {
    return null
  }

  const filteredTools = groupedTools.map(group => ({
    ...group,
    tools: group.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.tools.length > 0)

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row w-full">
        <aside className="md:w-72 w-full bg-gray-900 text-white p-4 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-6">
          <Button
  onClick={async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }}
  className="w-full bg-red-600 hover:bg-red-700 mt-4"
>
  Sign Out
</Button>

            <Image
              src="https://via.placeholder.com/40"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-sm">Welcome,</p>
              <p className="font-semibold">Journalist</p>
            </div>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full px-3 py-2 mb-4 text-sm rounded bg-gray-800 border border-gray-700 placeholder-gray-400"
          />
          {filteredTools.length === 0 ? (
            <p className="text-gray-400 text-sm">🔍 No tools found</p>
          ) : (
            filteredTools.map(group => (
              <div key={group.category} className="mb-6">
                <h3 className="text-md font-semibold text-gray-300 mb-2">{group.category}</h3>
                {group.tools.map(tool => (
                  <button
                    key={tool.name}
                    onClick={() => setSelectedTool(tool)}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${selectedTool.name === tool.name ? 'bg-gray-800 font-bold' : ''}`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            ))
          )}
        </aside>

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

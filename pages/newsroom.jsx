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
import { Button } from '@/components/ui/button'

export default function Newsroom() {
  return (
    <DashboardLayout>
      <h1 className='text-2xl font-bold text-blue-700 mb-6'>DRN.today Newsroom</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SmartComposer />
        <AIResearchAssistant />
        <AIFactChecker />
        <AIHeadlineOptimizer />
        <AutoTranslator />
        <VoiceToArticle />
        <PhotoSelector />
        <BreakingNewsTicker />
        <PressRewriter />
        <SchedulingAssistant />
        <EarningsDashboard />
        <MediaEditor />
        <ContentCalendar />
        <AnalyticsPanel />
        <CollaborationRoom />
        <TipInbox />
      </div>

      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        <Button className="rounded-full shadow-lg" size="icon">
          📝
        </Button>
        <Button className="rounded-full shadow-lg" size="icon">
          🧠
        </Button>
        <Button className="rounded-full shadow-lg" size="icon">
          📰
        </Button>
        <Button className="rounded-full shadow-lg" size="icon">
          🎙️
        </Button>
        <Button className="rounded-full shadow-lg" size="icon">
          📅
        </Button>
      </div>
    </DashboardLayout>
  )
}

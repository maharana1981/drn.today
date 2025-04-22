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


export default function Newsroom() {
  return (
    <DashboardLayout>
      <h1 className='text-2xl font-bold text-blue-700 mb-6'>🧪 Newsroom Dashboard (Dev Mode)</h1>

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

    </DashboardLayout>
  )
}

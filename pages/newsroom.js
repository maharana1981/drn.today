import DashboardLayout from '@/components/layouts/DashboardLayout'
import SmartComposer from '@/components/SmartComposer'
import AIResearchAssistant from '@/components/AIResearchAssistant'
import MediaEditor from '@/components/MediaEditor'
import ContentCalendar from '@/components/ContentCalendar'
import AnalyticsPanel from '@/components/AnalyticsPanel'
import CollaborationRoom from '@/components/CollaborationRoom'

export default function Newsroom() {
  return (
    <DashboardLayout>
      <h1 className='text-2xl font-bold text-blue-700 mb-6'>🧪 Newsroom Dashboard (Dev Mode)</h1>

      <SmartComposer />
      <AIResearchAssistant />
      <MediaEditor />
      <ContentCalendar />
      <AnalyticsPanel />
      <CollaborationRoom />
    </DashboardLayout>
  )
}

import DashboardLayout from '@/components/layouts/DashboardLayout'
import SmartComposer from '@/components/SmartComposer'
import AIResearchAssistant from '@/components/AIResearchAssistant'

export default function DevDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">🚧 Dev Dashboard (No Auth)</h1>
      <SmartComposer />
      <AIResearchAssistant />
    </DashboardLayout>
  )
}

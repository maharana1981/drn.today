import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import SmartComposer from '@/components/SmartComposer'
import AIResearchAssistant from '@/components/AIResearchAssistant'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <motion.h1
        className="text-3xl font-bold text-blue-700 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        DRN.today Newsroom
      </motion.h1>

      <SmartComposer />
      <AIResearchAssistant />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Feature Cards (same as before) */}
      </div>

      <div className="mt-10">
        <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
      </div>
    </DashboardLayout>
  )
}

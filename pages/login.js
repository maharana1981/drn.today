import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-slate-100">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-blue-700"
      >
        Journalist Login
      </motion.h1>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <Button onClick={handleLogin} className="text-white bg-blue-600 hover:bg-blue-700">
          Login with Google
        </Button>
      </motion.div>
    </div>
  )
}
// trigger redeploy

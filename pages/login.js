import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const router = useRouter()

  // ✅ Always track auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // ✅ Delay before checking session to avoid loop
  useEffect(() => {
    const checkSession = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800)) // 👈 delay added

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push('/dashboard')
      }
    }

    checkSession()
  }, [])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.drn.today/dashboard',
      },
    })
  }

  const handleEmailLogin = async () => {
    if (!email) return alert('Please enter an email')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Magic link sent to email!')
  }

  const handlePhoneLogin = async () => {
    if (!phone) return alert('Please enter a phone number')
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) alert(error.message)
    else alert('OTP sent to phone!')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-slate-100">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-blue-700"
      >
        DRN.today Login
      </motion.h1>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Login with Google
        </Button>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter email for magic link"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleEmailLogin} className="w-full">
            Send Magic Link
          </Button>
        </div>

        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="Enter your phone for OTP"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button onClick={handlePhoneLogin} className="w-full">
            Send OTP
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

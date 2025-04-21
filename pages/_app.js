import '@/styles/globals.css'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 🔐 Persist Supabase session on client
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🧠 Supabase Auth Event:', event)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} />
}

import { supabase } from "../lib/supabase"
import Head from "next/head"
import { motion } from "framer-motion"

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  return (
    <>
      <Head>
        <title>Login – drn.today</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 flex items-center justify-center text-center px-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Welcome to DRN.today</h1>
          <p className="text-gray-600 mb-6">Verified journalists can login using Google to post articles, videos, and images.</p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md"
          >
            Login with Google
          </button>
        </motion.div>
      </div>
    </>
  )
}

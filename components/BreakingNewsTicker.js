import { useEffect, useState } from 'react'

const fakeHeadlines = [
  '🌍 Global Water Shortage Hits New High',
  '🚀 NASA Confirms Lunar Colony Plans by 2030',
  '🤖 AI Journalism Ethics Under Global Review',
  '📉 Market Dips After Climate Report Release',
  '🎥 Citizen Footage of Mars Dust Storm Goes Viral',
]

export default function BreakingNewsTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % fakeHeadlines.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-red-600 text-white font-semibold text-sm px-4 py-2 overflow-hidden whitespace-nowrap">
      <marquee behavior="scroll" direction="left" scrollamount="4">
        🔥 BREAKING: {fakeHeadlines[index]}
      </marquee>
    </div>
  )
}

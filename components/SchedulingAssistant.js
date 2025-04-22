import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function SchedulingAssistant() {
  const [dateTime, setDateTime] = useState('')
  const [suggestion, setSuggestion] = useState(null)

  const suggestTime = () => {
    setSuggestion('🧠 Best Time: Tomorrow at 10:00 AM IST (High engagement predicted)')
  }

  const handleChange = (e) => {
    setDateTime(e.target.value

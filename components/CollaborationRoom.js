import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CollaborationRoom() {
  const [messages, setMessages] = useState([
    { from: 'Alex', text: 'Let’s finalize the headline by 3 PM.' },
    { from: 'Jordan', text: 'Adding quotes from the press release now.' },
  ])

  const [tasks, setTasks] = useState([
    { text: 'Review AI summary', done: false },
    { text: 'Add images to climate story', done: true },
  ])

  const [input, setInput] = useState('')
  const [newTask, setNewTask] = useState('')

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'You', text: input }])
      setInput('')
    }
  }

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, done: false }])
      setNewTask('')
    }

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
  }

  const toggleTask = (i) => {
    const updated = [...tasks]
    updated[i].done = !updated[i].done
    setTasks(updated)
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-6 p-4">
        <h2 className="text-xl font-semibold">🤝 Collaboration Room</h2>

        {/* 🗨️ Chat Box */}
        <div>
          <p className="font-medium mb-2">💬 Team Chat</p>
          <div className="bg-slate-100 rounded p-2 h-40 overflow-y-auto text-sm mb-2">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.from}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>

        {/* ✅ Task List */}
        <div>
          <p className="font-medium mb-2">✅ Task Tracker</p>
          <ul className="space-y-1 text-sm mb-2">
            {tasks.map((task, i) => (
              <li
                key={i}
                className={`cursor-pointer ${
                  task.done ? 'line-through text-gray-500' : ''
                }`}
                onClick={() => toggleTask(i)}
              >
                • {task.text}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              placeholder="New task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button variant="secondary" onClick={addTask}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

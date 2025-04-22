import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function VoiceToArticle() {
  const [audioURL, setAudioURL] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    const chunks = []

    recorder.ondataavailable = (e) => chunks.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      setAudioURL(url)

      // Simulate transcription
      setTimeout(() => {
        setTranscript(
          '🎤 “Today’s top story is about the increasing global water crisis, and how cities are adapting to shortages.”'
        )
      }, 2000)
    }

    recorder.start()
    setMediaRecorder(recorder)
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRecorder.stop()
    setRecording(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAudioURL(URL.createObjectURL(file))

      // Simulate transcription
      setTimeout(() => {
        setTranscript(
          '📂 “Uploaded audio transcription: Experts warn that climate change could accelerate the depletion of groundwater.”'
        )
      }, 2000)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">🎤 Voice-to-Article Converter</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Button onClick={recording ? stopRecording : startRecording}>
            {recording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
          </Button>
          <Input type="file" accept="audio/*" onChange={handleFileUpload} />
        </div>

        {audioURL && (
          <audio className="mt-4" controls src={audioURL}>
            Your browser does not support the audio tag.
          </audio>
        )}

        {transcript && (
          <div className="mt-4">
            <p className="text-sm

// Owner: Member 1 - Ishrat
import { useState, useRef } from 'react'

export default function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [blob, setBlob] = useState(null)
  const mediaRecorder = useRef(null)

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)
    const chunks = []
    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.current.onstop = () => setBlob(new Blob(chunks, { type: 'audio/webm' }))
    mediaRecorder.current.start()
    setIsRecording(true)
  }

  const stop = () => {
    mediaRecorder.current.stop()
    setIsRecording(false)
  }

  return { isRecording, blob, start, stop }
}
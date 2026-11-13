// Owner: Member 1
// Wraps the browser microphone (getUserMedia + MediaRecorder).
import { useState, useRef, useCallback, useEffect } from 'react'

export default function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState(null)

  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const resolveRef = useRef(null)
  const cancelledRef = useRef(false)

  // Turn off the mic and the timer
  const cleanup = () => {
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setIsRecording(false)
  }

  const start = useCallback(async () => {
    setError(null)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('unsupported')
      return false
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((m) =>
        MediaRecorder.isTypeSupported(m)
      )
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)

      chunksRef.current = []
      cancelledRef.current = false

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstop = () => {
        const blob = cancelledRef.current
          ? null
          : new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        cleanup()
        if (resolveRef.current) {
          resolveRef.current(blob)
          resolveRef.current = null
        }
      }

      rec.start()
      recorderRef.current = rec
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
      setIsRecording(true)
      return true
    } catch (err) {
      cleanup()
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') setError('denied')
      else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') setError('no-mic')
      else setError('unknown')
      return false
    }
  }, [])

  // Stops recording and resolves with the audio Blob (or null)
  const stop = useCallback(
    () =>
      new Promise((resolve) => {
        const rec = recorderRef.current
        if (!rec || rec.state === 'inactive') return resolve(null)
        resolveRef.current = resolve
        rec.stop()
      }),
    []
  )

  // Stops recording and throws the audio away
  const cancel = useCallback(() => {
    const rec = recorderRef.current
    cancelledRef.current = true
    if (rec && rec.state !== 'inactive') rec.stop()
    else cleanup()
  }, [])

  // Release the mic if the page is closed while recording
  useEffect(() => {
    return () => cleanup()
  }, [])

  return { start, stop, cancel, isRecording, seconds, error, setError }
}
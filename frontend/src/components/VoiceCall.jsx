// Owner: Member 1
// Push-to-talk voice assistant: record -> send to backend -> show + speak reply.
import { useState, useRef } from 'react'
import useRecorder from '../hooks/useRecorder'
import { useFarmer } from '../context/FarmerContext'
import { sendVoice, sendText } from '../api/client'

const MIC_MESSAGES = {
  denied: 'Microphone access is blocked. Click the lock icon in the address bar, allow the microphone, then try again.',
  'no-mic': 'No microphone was found. Please connect one and try again.',
  unsupported: 'This browser cannot record audio. Please use Google Chrome.',
  unknown: 'Could not start the microphone. Please try again.',
}

export default function VoiceCall({ onExchange }) {
  const { start, stop, cancel, isRecording, seconds, error: micError, setError: setMicError } =
    useRecorder()

  // Works whether the context returns { farmer } or { profile }
  const ctx = useFarmer()
  const farmer = ctx?.farmer ?? ctx?.profile ?? {}
  const farmerId = farmer.farmer_id || 'F101'
  const crop = farmer.crop || 'Cotton'

  const [status, setStatus] = useState('idle') // idle | listening | thinking | speaking
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [muted, setMuted] = useState(false)
  const [backupNote, setBackupNote] = useState(false)
  const audioRef = useRef(null)

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setStatus('idle')
  }

  // Plays the backend audio, or reads the text aloud if there is no audio
  const speak = (data) =>
    new Promise((resolve) => {
      if (muted) return resolve()
      if (data.reply_audio_base64) {
        const a = new Audio('data:audio/wav;base64,' + data.reply_audio_base64)
        audioRef.current = a
        a.onended = resolve
        a.onerror = resolve
        a.play().catch(resolve)
        return
      }
      if ('speechSynthesis' in window && data.reply_text) {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(data.reply_text)
        u.lang = 'en-IN'
        u.onend = resolve
        u.onerror = resolve
        window.speechSynthesis.speak(u)
        return
      }
      resolve()
    })

  const showResult = async (data) => {
    setTranscript(data.transcript || '')
    setReply(data.reply_text || '')
    if (onExchange) onExchange(data) // lets the cards update from the voice reply
    setStatus('speaking')
    await speak(data)
    setStatus('idle')
  }

  const handleCall = async () => {
    setError('')
    setMicError(null)

    if (status === 'thinking') return
    if (status === 'listening' && !isRecording) return // backup mode is listening
    if (status === 'speaking') return stopSpeaking()

    if (!isRecording) {
      setBackupNote(false)
      const ok = await start()
      if (ok) setStatus('listening')
      return
    }

    // Second tap: stop and send
    const blob = await stop()
    console.log('Recorded audio:', blob?.size, 'bytes,', blob?.type)
    if (!blob || blob.size === 0) {
      setStatus('idle')
      setError('No audio was captured. Please try again.')
      return
    }
    setStatus('thinking')
    try {
      const data = await sendVoice(blob, 'en', farmerId, crop)
      await showResult(data)
    } catch (e) {
      setStatus('idle')
      setError('Could not reach the voice service. You can try the backup voice mode.')
    }
  }

  const handleCancel = () => {
    cancel()
    setStatus('idle')
  }

  // Backup: browser speech recognition -> text endpoint
  const backupVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setError('Backup voice mode is not supported in this browser. Please use Chrome or type your question.')
      return
    }
    setError('')
    setBackupNote(true)
    setStatus('listening')
    const rec = new SR()
    rec.lang = 'en-IN'
    rec.onresult = async (e) => {
      const text = e.results[0][0].transcript
      setStatus('thinking')
      try {
        const data = await sendText(text, 'en', farmerId, crop)
        await showResult({ ...data, transcript: text })
      } catch (err) {
        setStatus('idle')
        setError('Could not get a reply. Please try again.')
      }
    }
    rec.onerror = () => {
      setStatus('idle')
      setError('Could not hear you. Please try again.')
    }
    rec.onend = () => setStatus((s) => (s === 'listening' ? 'idle' : s))
    rec.start()
  }

  const mm = Math.floor(seconds / 60)
  const ss = String(seconds % 60).padStart(2, '0')

  const labels = {
    idle: 'Tap to speak',
    listening: isRecording ? `Listening... ${mm}:${ss} (tap to send)` : 'Listening... speak now',
    thinking: 'Thinking...',
    speaking: 'Speaking... (tap to stop)',
  }
  const icons = { idle: '🎤', listening: '⏹', thinking: '⏳', speaking: '🔊' }
  const colors = {
    idle: 'bg-green-600 hover:bg-green-700',
    listening: 'bg-red-500 hover:bg-red-600',
    thinking: 'bg-gray-400',
    speaking: 'bg-blue-500 hover:bg-blue-600',
  }

  const shownError = error || (micError ? MIC_MESSAGES[micError] : '')

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 text-center shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-green-800">Voice Assistant</h2>
        <button
          onClick={() => setMuted((m) => !m)}
          className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-800"
        >
          {muted ? '🔇 Muted' : '🔈 Sound on'}
        </button>
      </div>

      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        {status === 'listening' && (
          <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-40" />
        )}
        <button
          onClick={handleCall}
          disabled={status === 'thinking'}
          aria-label="Voice call button"
          className={`relative h-24 w-24 rounded-full text-4xl text-white shadow-lg transition ${colors[status]}`}
        >
          {status === 'thinking' ? (
            <span className="inline-block animate-spin">⏳</span>
          ) : (
            icons[status]
          )}
        </button>
      </div>

      {status === 'speaking' && (
        <div className="mt-2 flex h-6 items-end justify-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1.5 animate-pulse rounded bg-blue-500"
              style={{ height: `${10 + ((i * 7) % 14)}px`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-base font-medium text-gray-700">{labels[status]}</p>

      {isRecording && (
        <button onClick={handleCancel} className="mt-2 text-sm text-gray-500 underline">
          Cancel
        </button>
      )}

      {backupNote && (
        <p className="mt-2 text-xs text-amber-600">Using backup voice mode</p>
      )}

      {shownError && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p>{shownError}</p>
          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={() => {
                setError('')
                setMicError(null)
              }}
              className="rounded-full bg-red-600 px-3 py-1 text-white"
            >
              Retry
            </button>
            <button
              onClick={backupVoice}
              className="rounded-full border border-red-300 px-3 py-1 text-red-700"
            >
              Use backup voice
            </button>
          </div>
        </div>
      )}

      {(transcript || reply) && (
        <div className="mt-4 space-y-2 text-left text-base">
          {transcript && (
            <p className="rounded-xl bg-green-50 p-3">
              <span className="font-semibold">You said:</span> {transcript}
            </p>
          )}
          {reply && (
            <p className="rounded-xl bg-gray-50 p-3">
              <span className="font-semibold">Assistant:</span> {reply}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
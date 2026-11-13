// Owner: Member 1
import { useState, useEffect, useRef } from 'react'
import { farmer as mockFarmer } from '../mock/index'
import { sendText } from '../api/client'

const SUGGESTIONS = [
  'My cotton leaves have yellow spots',
  'When should I irrigate?',
  'What is the weather this week?',
]

export default function Chat({ onReply }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello. Ask me about your crop, weather, or irrigation.' },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, thinking])

  async function handleSend(text) {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setError(null)
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setThinking(true)

    try {
      const reply = await sendText(msg, 'en', mockFarmer.farmer_id, mockFarmer.crop)
      setMessages((m) => [...m, { role: 'assistant', text: reply.reply_text }])
      if (onReply) onReply(reply)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setMessages((m) => [...m, { role: 'error', text: 'Sorry, I could not get a response.' }])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="flex flex-col h-[70vh] sm:h-[60vh]">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-2 space-y-2"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 rounded-2xl text-base leading-snug ${
                m.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-md'
                  : m.role === 'error'
                  ? 'bg-red-100 text-red-800 rounded-bl-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-green-100'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-3 py-2 rounded-2xl rounded-bl-md shadow-sm border border-green-100 flex items-center gap-1">
              <span>Thinking</span>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-end">
            <button
              onClick={() => handleSend(messages[messages.length - 2]?.text || input)}
              className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="px-1 pt-2 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSend(s)}
            className="text-sm bg-green-50 text-green-800 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="px-1 pt-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type your question..."
          className="flex-1 border border-green-200 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={() => handleSend()}
          className="bg-green-600 text-white text-lg px-5 py-2.5 rounded-xl hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}
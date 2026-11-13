// Owner: Member 1 - 
import { useState } from 'react'
import { sendText } from '../api/client'
import { useLanguage } from '../context/LanguageContext'

export default function Chat() {
  const { lang } = useLanguage()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    const res = await sendText(input, lang, 'F101', 'cotton')
    setMessages([...messages, { type: 'user', text: input }, { type: 'agent', text: res.reply_text }])
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.type === 'user' ? 'bg-green-100 ml-auto' : 'bg-white'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border p-2" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="bg-green-600 text-white p-2" onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

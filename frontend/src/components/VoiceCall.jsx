// Owner: Member 1 - 
import { useState } from 'react'
import { sendVoice, uploadImage } from '../api/client'
import { useLanguage } from '../context/LanguageContext'

export default function VoiceCall() {
  const { lang } = useLanguage()
  const [response, setResponse] = useState(null)

  const handleUpload = async (file) => {
    const res = await uploadImage(file, lang, 'F101', 'cotton')
    setResponse(res)
  }

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Voice Assistance</h2>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {response && <p className="mt-2 text-sm text-green-800">{response.reply_text}</p>}
    </div>
  )
}

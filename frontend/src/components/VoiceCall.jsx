// Owner: Member 1 - 
import { useState } from 'react'
import { uploadImage } from '../api/client'

export default function VoiceCall() {
  const [response, setResponse] = useState(null)

  const handleUpload = async (file) => {
    const res = await uploadImage(file, 'en', 'F101', 'cotton')
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

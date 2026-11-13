// Owner: Member 1 - 
import { useState } from 'react'
import { uploadImage } from '../api/client'

export default function ImageUpload({ onUploaded }) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const res = await uploadImage(file, 'en', 'F101', 'cotton')
    setLoading(false)
    if (onUploaded) onUploaded(res)
  }

  return (
    <div className="border border-dashed p-4 text-center">
      <input type="file" accept="image/*" onChange={handleChange} />
      {loading && <p>Uploading...</p>}
    </div>
  )
}

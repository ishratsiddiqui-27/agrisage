// Owner: Member 1 - Ishrat
import { useState } from 'react'
import { uploadImage } from '../api/client'
import { useLanguage } from '../context/LanguageContext'

export default function ImageUpload({ onUploaded }) {
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const res = await uploadImage(file, lang, 'F101', 'cotton')
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
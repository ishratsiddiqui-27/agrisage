// Owner: Member 1
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getCases } from '../api/client'

export default function Farmer() {
  const { lang } = useLanguage()
  const [count, setCount] = useState(null)

  const handleFetch = async () => {
    const cases = await getCases()
    setCount(cases.length)
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {lang === 'te' && 'రైతు'}
        {lang === 'hi' && 'किसान'}
        {lang === 'en' && 'Farmer'}
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        {lang === 'en' && 'Welcome to AgriSage AI — your voice-first agriculture companion.'}
      </p>
      {/* TEMP - remove later */}
      <button
        onClick={handleFetch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fetch Cases (TEMP)
      </button>
      {count !== null && <p className="mt-2 text-sm text-gray-600">Total cases: {count}</p>}
    </div>
  )
}
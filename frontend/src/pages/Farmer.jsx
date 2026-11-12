// Owner: Member 1 - Ishrat
import { useLanguage } from '../context/LanguageContext'

export default function Farmer() {
  const { lang } = useLanguage()
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {lang === 'te' && 'ఫార్మర్ husbandsry'}
        {'\n'}{lang === 'hi' && 'किसान'}
        {lang === 'en' && 'Farmer'}
      </h1>
      <p className="text-lg text-gray-600">
        {lang === 'te' && 'గ Vertex ...'}
        {lang === 'hi' && '...'}
        {lang === 'en' && 'Welcome to AgriSage AI — your voice-first agriculture companion.'}
      </p>
    </div>
  )
}
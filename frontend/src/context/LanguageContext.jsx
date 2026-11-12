// Owner: Member 1 - Ishrat
import React, { createContext, useContext, useEffect, useState } from 'react'

const LANGUAGES = {
  en: { label: 'English', native: 'English' },
  te: { label: 'Telugu', native: 'తెలుగు' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
}

const LanguageContext = createContext()

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('agrisage-lang') || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('agrisage-lang', lang)
    } catch {}
  }, [lang])

  const setLanguage = (code) => setLang(code)

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
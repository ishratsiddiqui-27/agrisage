// Owner: Member 1
import React, { createContext, useContext, useState, useEffect } from 'react'
import { farmer as mockFarmer } from '../mock/index'
import { sendText } from '../api/client'

const FarmerContext = createContext()

export function useFarmer() {
  const ctx = useContext(FarmerContext)
  if (!ctx) throw new Error('useFarmer must be used within FarmerProvider')
  return ctx
}

export function FarmerProvider({ children }) {
  const [farmer, setFarmer] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisage-farmer')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...mockFarmer,
          ...parsed,
          soil: {
            ...mockFarmer.soil,
            ...(parsed.soil || {})
          }
        }
      }
    } catch {}
    return mockFarmer
  })

  useEffect(() => {
    try {
      localStorage.setItem('agrisage-farmer', JSON.stringify(farmer))
    } catch {}
  }, [farmer])

  const setProfile = (updates) => {
    setFarmer((prev) => ({
      ...prev,
      ...updates,
      soil: updates.soil ? { ...prev.soil, ...updates.soil } : prev.soil
    }))
  }

  const fetchInsights = async (f) => {
    try {
      await sendText('Analyze my farm', 'en', f?.farmer_id || mockFarmer.farmer_id, f?.crop || mockFarmer.crop)
    } catch (e) {
      console.error('Failed to fetch insights:', e)
    }
  }

  return (
    <FarmerContext.Provider value={{ farmer, profile: farmer, setProfile, loading: false, error: null, fetchInsights }}>
      {children}
    </FarmerContext.Provider>
  )
}

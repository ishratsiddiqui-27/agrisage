// Owner: Member 1
// Small floating badge: shows live/offline/demo state and lets you switch to demo data.
import { useState, useEffect } from 'react'
import { checkHealth, getMockMode, setMockMode } from '../api/client'

export default function ConnectionBadge() {
  const mock = getMockMode()
  const [online, setOnline] = useState(null) // null = still checking

  useEffect(() => {
    if (mock) return
    let active = true
    const ping = async () => {
      try {
        await checkHealth()
        if (active) setOnline(true)
      } catch (e) {
        if (active) setOnline(false)
      }
    }
    ping()
    const timer = setInterval(ping, 10000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [mock])

  const toggle = () => {
    setMockMode(!mock)
    window.location.reload() // simplest way to make every page use the new mode
  }

  let dot = 'bg-gray-400'
  let text = 'Checking backend...'
  if (mock) {
    dot = 'bg-amber-500'
    text = 'Demo mode (sample data)'
  } else if (online === true) {
    dot = 'bg-green-500'
    text = 'Backend connected'
  } else if (online === false) {
    dot = 'bg-red-500'
    text = 'Backend offline'
  }

  return (
    <div className="fixed bottom-3 left-3 z-[1100] flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <span className={`inline-block h-3 w-3 rounded-full ${dot}`} />
      <span className="text-gray-700">{text}</span>
      <button
        onClick={toggle}
        className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-100"
      >
        {mock ? 'Use live backend' : 'Use demo data'}
      </button>
    </div>
  )
}
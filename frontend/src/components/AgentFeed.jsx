// Owner: Member 1
// Timeline showing the agents working one after another.
import { useState, useEffect } from 'react'

const ORDER = [
  { key: 'disease', label: 'Disease Agent', icon: '🍃' },
  { key: 'weather', label: 'Weather Agent', icon: '🌦' },
  { key: 'irrigation', label: 'Irrigation Agent', icon: '💧' },
  { key: 'yield', label: 'Yield Agent', icon: '📈' },
  { key: 'market', label: 'Market Agent', icon: '🏪' },
  { key: 'advisory', label: 'Advisory Agent', icon: '🧑‍🌾' },
]

// Shown only when the backend sends no agent results (demo / mock mode)
const SAMPLE = {
  disease: 'Possible fungal leaf spot (82% confidence)',
  weather: 'Humid, light rain expected in 2 days',
  irrigation: 'Skip irrigation for 2 days, rain expected',
  yield: 'Predicted 2.1 t/ha, about 15% above average',
  market: 'Cotton price rising slowly this week',
  advisory: 'Avoid overhead irrigation and get an expert check',
}

// One-line summary of an agent result
const summarize = (f) => {
  if (typeof f?.prediction === 'string' && f.prediction) {
    const c =
      typeof f.confidence === 'number'
        ? ` (${Math.round(f.confidence <= 1 ? f.confidence * 100 : f.confidence)}% confidence)`
        : ''
    return f.prediction + c
  }
  const entries =
    f?.data && typeof f.data === 'object'
      ? Object.entries(f.data)
          .filter(([, v]) => v !== null && typeof v !== 'object')
          .slice(0, 2)
      : []
  if (entries.length) return entries.map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
  return 'Done'
}

export default function AgentFeed({ findings, runKey = 0 }) {
  const list = Array.isArray(findings) ? findings : []
  const [visible, setVisible] = useState(0)

  // Replays the animation whenever runKey changes (a new reply arrives)
  useEffect(() => {
    setVisible(0)
    const timers = ORDER.map((_, i) => setTimeout(() => setVisible(i + 1), 700 * (i + 1)))
    return () => timers.forEach(clearTimeout)
  }, [runKey])

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-green-800">🤖 Agent Activity</h3>
      <ol className="space-y-3">
        {ORDER.map((a, i) => {
          const f = list.find((x) => String(x?.agent || '').toLowerCase().includes(a.key))
          const text = f ? summarize(f) : SAMPLE[a.key]
          const done = i < visible
          const running = i === visible
          return (
            <li
              key={a.key}
              className={`flex items-start gap-3 transition-opacity duration-500 ${
                done || running ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${
                  done ? 'bg-green-100' : running ? 'animate-pulse bg-amber-100' : 'bg-gray-100'
                }`}
              >
                {a.icon}
              </span>
              <div className="min-w-0">
                <p className="text-base font-medium text-gray-800">
                  {a.label}{' '}
                  <span
                    className={`ml-1 text-xs font-normal ${
                      done ? 'text-green-600' : running ? 'text-amber-600' : 'text-gray-400'
                    }`}
                  >
                    {done ? '✓ Done' : running ? 'Running...' : 'Waiting'}
                  </span>
                </p>
                {done && <p className="text-sm text-gray-600">{text}</p>}
              </div>
            </li>
          )
        })}
      </ol>
      {list.length === 0 && (
        <p className="mt-3 text-xs text-gray-400">
          Sample activity shown until real agent results arrive.
        </p>
      )}
    </div>
  )
}
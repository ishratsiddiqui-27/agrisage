// Owner: Member 1
// Predicted yield vs historical average (bar chart).
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'

const findAgent = (data, word) =>
  Array.isArray(data)
    ? data.find((a) => String(a?.agent || '').toLowerCase().includes(word))
    : null

const firstNumber = (...vals) => {
  for (const v of vals) {
    if (v === null || v === undefined || v === '') continue
    const n = Number(v)
    if (!Number.isNaN(n)) return n
  }
  return null
}

export default function YieldCard({ data }) {
  const a = findAgent(data, 'yield')
  const d = a?.data && typeof a.data === 'object' ? a.data : {}

  // Falls back to sample numbers when the backend sends nothing
  const predicted =
    firstNumber(d.predicted_tonnes_per_ha, d.predicted_yield, d.predicted, a?.prediction) ?? 2.1
  const historical =
    firstNumber(d.historical_avg, d.historical_average, d.baseline, d.average) ?? 1.8

  const diff = predicted - historical
  const pct = historical ? Math.round((diff / historical) * 100) : 0
  const up = diff >= 0

  const chart = [
    { name: 'Historical average', value: Number(historical.toFixed(2)) },
    { name: 'Predicted this season', value: Number(predicted.toFixed(2)) },
  ]

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-green-800">📈 Yield Prediction</h3>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-3xl font-bold text-gray-800">
            {predicted.toFixed(2)}{' '}
            <span className="text-base font-normal text-gray-500">tonnes/ha</span>
          </p>
          <p className="text-sm text-gray-500">Predicted for this season</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {up ? '▲' : '▼'} {Math.abs(pct)}% vs average
        </span>
      </div>

      <div className="mt-3 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={35} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chart.map((entry, i) => (
                <Cell key={entry.name} fill={i === 0 ? '#9ca3af' : '#16a34a'} />
              ))}
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Indicative estimate from past yields and weather, not a guarantee.
      </p>
    </div>
  )
}
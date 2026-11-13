// Owner: Member 1
// Recent mandi prices (line chart), trend and nearby markets.
import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

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

const toShort = (d) => {
  const dt = new Date(d)
  return Number.isNaN(dt.getTime())
    ? String(d)
    : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Sample prices (rupees per quintal) used when the backend sends no history
const sampleHistory = () =>
  Array.from({ length: 14 }, (_, i) => ({
    day: toShort(Date.now() - (13 - i) * 86400000),
    price: 6900 + i * 22 + ((i * 37) % 5) * 18,
  }))

const SAMPLE_NEARBY = [
  { market: 'Nizamabad', price: 7320 },
  { market: 'Warangal', price: 7280 },
  { market: 'Karimnagar', price: 7410 },
]

export default function MarketCard({ data }) {
  const a = findAgent(data, 'market')
  const d = a?.data && typeof a.data === 'object' ? a.data : {}

  const rawHistory = Array.isArray(d.history) ? d.history : Array.isArray(d.prices) ? d.prices : null

  const history = useMemo(() => {
    const mapped = rawHistory
      ? rawHistory
          .map((r, i) => ({
            day: r?.date ? toShort(r.date) : `Day ${i + 1}`,
            price: firstNumber(r?.modal_price, r?.price),
          }))
          .filter((r) => r.price !== null)
      : []
    return mapped.length > 1 ? mapped : sampleHistory()
  }, [rawHistory])

  const latest =
    firstNumber(d.latest_modal_price, d.modal_price, d.current_price) ??
    history[history.length - 1].price
  const first = history[0].price
  const change = first ? ((latest - first) / first) * 100 : 0

  // Trend: use the backend value if it is clear, otherwise work it out
  const t = String(d.trend || '').toLowerCase()
  const trend = /^(up|ris|inc)/.test(t)
    ? 'up'
    : /^(down|fall|dec)/.test(t)
    ? 'down'
    : change > 1
    ? 'up'
    : change < -1
    ? 'down'
    : 'stable'
  const trendMeta = {
    up: { text: '▲ Rising', style: 'bg-green-100 text-green-700' },
    down: { text: '▼ Falling', style: 'bg-red-100 text-red-700' },
    stable: { text: '→ Stable', style: 'bg-gray-100 text-gray-700' },
  }[trend]

  const rawNearby = d.nearby_markets ?? d.nearby ?? d.markets
  const nearby = (Array.isArray(rawNearby) && rawNearby.length ? rawNearby : SAMPLE_NEARBY).map(
    (m) =>
      typeof m === 'string'
        ? { market: m, price: null }
        : { market: m?.market || m?.name || 'Market', price: firstNumber(m?.price, m?.modal_price) }
  )

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-green-800">🏪 Market Price</h3>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-3xl font-bold text-gray-800">
            ₹{Math.round(latest).toLocaleString('en-IN')}{' '}
            <span className="text-base font-normal text-gray-500">/ quintal</span>
          </p>
          <p className="text-sm text-gray-500">Latest modal price</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${trendMeta.style}`}>
          {trendMeta.text}
        </span>
      </div>

      <div className="mt-3 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} width={45} domain={['auto', 'auto']} />
            <Tooltip formatter={(v) => [`₹${v}`, 'Modal price']} />
            <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h4 className="mb-1 mt-3 text-sm font-semibold text-gray-700">Nearby markets</h4>
      <ul className="space-y-1 text-sm">
        {nearby.map((m) => (
          <li key={m.market} className="flex justify-between">
            <span className="text-gray-600">{m.market}</span>
            <span className="font-medium text-gray-800">
              {m.price !== null ? `₹${Math.round(m.price).toLocaleString('en-IN')}` : '-'}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-400">
        Indicative trend from past prices, not a guaranteed future price.
      </p>
    </div>
  )
}
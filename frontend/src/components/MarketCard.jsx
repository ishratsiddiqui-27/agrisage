// Owner: Member 1
export default function MarketCard({ data }) {
  const market = (data || []).find((a) => a.agent === 'market')
  if (!market) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
        <h3 className="font-semibold text-gray-500 flex items-center gap-2">
          <span>📈</span> Market Intelligence
        </h3>
        <p className="text-sm text-gray-400 mt-2">No market data yet.</p>
      </div>
    )
  }
  const d = market.data ?? {}
  const price = d?.latest_modal_price ?? d?.modal_price ?? '—'
  const trend = d?.trend ?? 'up'
  const markets = d?.nearby_markets ?? ['Nizamabad Mandi', 'Kamareddy Market']

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <span>📈</span> Market Intelligence
      </h3>
      <div className="flex items-baseline justify-between mt-3">
        <div>
          <p className="text-xs text-gray-500">Modal Price</p>
          <p className="text-xl font-bold text-green-700">₹{price}/q</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {trend === 'up' ? '📈 Up Trend' : '📉 Down Trend'}
        </span>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <span>Nearby: {markets.join(', ')}</span>
      </div>
    </div>
  )
}

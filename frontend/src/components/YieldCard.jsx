// Owner: Member 1
export default function YieldCard({ data }) {
  const yieldAgent = (data || []).find((a) => a.agent === 'yield')
  if (!yieldAgent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
        <h3 className="font-semibold text-gray-500 flex items-center gap-2">
          <span>🌾</span> Yield Forecast
        </h3>
        <p className="text-sm text-gray-400 mt-2">No yield data yet.</p>
      </div>
    )
  }
  const d = yieldAgent.data ?? {}
  const predicted = d?.predicted_tonnes_per_ha ?? d?.estimated_yield_q_ha ?? '—'
  const avg = d?.historical_avg ?? '—'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <span>🌾</span> Yield Forecast
      </h3>
      <div className="flex items-baseline justify-between mt-3">
        <div>
          <p className="text-xs text-gray-500">Predicted Yield</p>
          <p className="text-xl font-bold text-green-700">{predicted} t/ha</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Historical Avg</p>
          <p className="text-sm font-semibold text-gray-600">{avg} t/ha</p>
        </div>
      </div>
    </div>
  )
}

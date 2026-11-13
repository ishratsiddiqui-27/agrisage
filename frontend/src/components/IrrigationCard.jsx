// Owner: Member 1
export default function IrrigationCard({ data }) {
  const irrigation = (data || []).find((a) => a.agent === 'irrigation')
  if (!irrigation) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
        <h3 className="font-semibold text-gray-500 flex items-center gap-2">
          <span>💧</span> Irrigation
        </h3>
        <p className="text-sm text-gray-400 mt-2">No irrigation data yet.</p>
      </div>
    )
  }
  const d = irrigation.data ?? {}
  const etc = d?.etc_mm_per_day ?? '—'
  const rain = d?.rainfall_mm ?? '—'
  const rec = d?.recommended_mm ?? '—'
  const advice = d?.advice ?? irrigation.prediction ?? ''

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <span>💧</span> Irrigation
      </h3>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-cyan-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">ETc / day</p>
          <p className="text-lg font-bold text-cyan-700">{etc}mm</p>
        </div>
        <div className="bg-cyan-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Rainfall</p>
          <p className="text-lg font-bold text-cyan-700">{rain}mm</p>
        </div>
        <div className="bg-cyan-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Recommended</p>
          <p className="text-lg font-bold text-cyan-700">{rec}mm</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-3 leading-snug">{advice}</p>
    </div>
  )
}

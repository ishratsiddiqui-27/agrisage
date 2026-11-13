// Owner: Member 1
export default function WeatherCard({ data }) {
  const weather = (data || []).find((a) => a.agent === 'weather')
  if (!weather) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
        <h3 className="font-semibold text-gray-500 flex items-center gap-2">
          <span>🌤️</span> Weather
        </h3>
        <p className="text-sm text-gray-400 mt-2">No weather data yet.</p>
      </div>
    )
  }
  const d = weather.data ?? {}
  const temp = d?.temp ?? '—'
  const humidity = d?.humidity ?? '—'
  const rain = d?.rainfall_mm ?? '—'
  const alert = d?.risk_alert ?? null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <span>🌤️</span> Weather
      </h3>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Temperature</p>
          <p className="text-lg font-bold text-green-700">{temp}°C</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Humidity</p>
          <p className="text-lg font-bold text-green-700">{humidity}%</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-gray-500">Rain (3d)</p>
          <p className="text-lg font-bold text-green-700">{rain}mm</p>
        </div>
      </div>
      {alert && (
        <span className="inline-block mt-3 text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
          ⚠️ {alert}
        </span>
      )}
    </div>
  )
}

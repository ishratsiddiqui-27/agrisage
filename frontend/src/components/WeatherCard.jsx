// Owner: Member 1 - Ishrat
export default function WeatherCard({ data }) {
  return (
    <div className="p-4 border rounded bg-blue-50">
      <h3 className="font-semibold text-blue-900">Weather</h3>
      <p>{data?.prediction || 'No weather data'}</p>
    </div>
  )
}
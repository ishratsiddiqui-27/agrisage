// Owner: Member 1 - Ishrat
export default function YieldCard({ data }) {
  return (
    <div className="p-4 border rounded bg-amber-50">
      <h3 className="font-semibold text-amber-900">Yield Forecast</h3>
      <p>{data?.prediction || 'No yield data'}</p>
    </div>
  )
}
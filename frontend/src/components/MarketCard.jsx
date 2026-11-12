// Owner: Member 1 - Ishrat
export default function MarketCard({ data }) {
  return (
    <div className="p-4 border rounded bg-emerald-50">
      <h3 className="font-semibold text-emerald-900">Market Intelligence</h3>
      <p>{data?.prediction || 'No market data'}</p>
    </div>
  )
}
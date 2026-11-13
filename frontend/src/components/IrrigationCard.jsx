// Owner: Member 1 - 
export default function IrrigationCard({ data }) {
  return (
    <div className="p-4 border rounded bg-cyan-50">
      <h3 className="font-semibold text-cyan-900">Irrigation</h3>
      <p>{data?.prediction || 'No irrigation data'}</p>
    </div>
  )
}

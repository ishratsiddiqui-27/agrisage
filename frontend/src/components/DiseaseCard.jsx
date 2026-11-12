// Owner: Member 1 - Ishrat
export default function DiseaseCard({ data }) {
  return (
    <div className="p-4 border rounded bg-rose-50">
      <h3 className="font-semibold text-rose-900">Disease Diagnostics</h3>
      <p>{data?.prediction || 'No diagnostics'}</p>
    </div>
  )
}
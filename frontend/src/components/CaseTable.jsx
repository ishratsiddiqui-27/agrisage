// Owner: Member 1
// Case table + small helpers shared with the case detail page.
import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  new: 'bg-red-100 text-red-700',
  assigned: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
}

export function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase()
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
        STATUS_STYLES[key] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status || 'Unknown'}
    </span>
  )
}

export const farmerName = (c) =>
  typeof c?.farmer === 'string' ? c.farmer : c?.farmer?.name || 'Unknown'

export const formatDate = (d) => {
  if (!d) return '-'
  const date = new Date(d)
  return isNaN(date.getTime()) ? String(d) : date.toLocaleString()
}

export default function CaseTable({ cases = [] }) {
  if (!cases.length) {
    return (
      <div className="rounded-2xl border border-green-100 bg-white p-8 text-center text-gray-500">
        No cases match these filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-green-100 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-base">
        <thead className="bg-green-50 text-sm uppercase text-green-800">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Farmer</th>
            <th className="px-4 py-3">Crop</th>
            <th className="px-4 py-3">District</th>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id} className="border-t border-gray-100 hover:bg-green-50/40">
              <td className="px-4 py-3 font-medium text-gray-700">{String(c.id)}</td>
              <td className="px-4 py-3">{farmerName(c)}</td>
              <td className="px-4 py-3">{c.crop || '-'}</td>
              <td className="px-4 py-3">{c.district || '-'}</td>
              <td className="max-w-[240px] truncate px-4 py-3 text-gray-600">
                {c.symptoms || c.summary || '-'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(c.created_at)}</td>
              <td className="px-4 py-3">
                <Link
                  to={`/expert/case/${c.id}`}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
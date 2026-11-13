// Owner: Member 1
// Expert dashboard: summary tiles, filters, live-refreshing case table.
import { useState, useEffect, useCallback } from 'react'
import { getCases } from '../api/client'
import CaseTable from '../components/CaseTable'
import ErrorBoundary from '../components/ErrorBoundary'
import RegionMap from '../components/RegionMap'
const sameStatus = (c, s) => String(c?.status || '').toLowerCase() === s.toLowerCase()

export default function ExpertDashboard() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [districtFilter, setDistrictFilter] = useState('All')
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    try {
      const data = await getCases()
      setCases(Array.isArray(data) ? [...data] : []) // new array so React re-renders
      setError('')
      setLastUpdated(new Date())
    } catch (e) {
      setError('Could not load cases. Trying again automatically...')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load now, then refresh every 5 seconds so new cases appear live
  useEffect(() => {
    load()
    const timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [load])

  const districts = ['All', ...Array.from(new Set(cases.map((c) => c.district).filter(Boolean))).sort()]

  const filtered = cases.filter(
    (c) =>
      (statusFilter === 'All' || sameStatus(c, statusFilter)) &&
      (districtFilter === 'All' || c.district === districtFilter)
  )

  const tiles = [
    { label: 'Total cases', value: cases.length, style: 'bg-white text-gray-800' },
    { label: 'New', value: cases.filter((c) => sameStatus(c, 'New')).length, style: 'bg-red-50 text-red-700' },
    { label: 'Assigned', value: cases.filter((c) => sameStatus(c, 'Assigned')).length, style: 'bg-amber-50 text-amber-700' },
    { label: 'Resolved', value: cases.filter((c) => sameStatus(c, 'Resolved')).length, style: 'bg-green-50 text-green-700' },
  ]

  const hasDemo = cases.some((c) => c.is_demo)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-bold text-green-800">Expert Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {hasDemo && (
                <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                  Demo data
                </span>
              )}
              {lastUpdated && <span>Updated {lastUpdated.toLocaleTimeString()}</span>}
            </div>
          </div>

          {/* Summary tiles */}
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {tiles.map((t) => (
              <div key={t.label} className={`rounded-2xl border border-green-100 p-4 shadow-sm ${t.style}`}>
                <p className="text-sm">{t.label}</p>
                <p className="text-3xl font-bold">{t.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3">
            <label className="text-sm text-gray-600">
              Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
              >
                {['All', 'New', 'Assigned', 'Resolved'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-600">
              District
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
              >
                {districts.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-6">
     <ErrorBoundary>
       <RegionMap cases={filtered} />
     </ErrorBoundary>
   </div>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-green-100 bg-white p-8 text-center text-gray-500">
              Loading cases...
            </div>
          ) : (
            <CaseTable cases={filtered} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
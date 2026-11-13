// Owner: Member 1
// One case: farmer info, photo, agent findings, status and expert reply.
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCases, updateCase } from '../api/client'
import { StatusBadge, farmerName, formatDate } from '../components/CaseTable'
import ErrorBoundary from '../components/ErrorBoundary'

// One card per agent result
function FindingCard({ f }) {
  const name = String(f?.agent || 'agent').replace(/_/g, ' ')
  const conf =
    typeof f?.confidence === 'number'
      ? Math.round(f.confidence <= 1 ? f.confidence * 100 : f.confidence)
      : null
  const entries =
    f?.data && typeof f.data === 'object'
      ? Object.entries(f.data)
          .filter(([, v]) => v === null || typeof v !== 'object')
          .slice(0, 6)
      : []

  return (
    <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold capitalize text-green-800">{name}</h3>
        {f?.needs_expert_review && (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
            Needs review
          </span>
        )}
      </div>
      {typeof f?.prediction === 'string' && (
        <p className="mt-1 text-lg font-medium text-gray-800">{f.prediction}</p>
      )}
      {conf !== null && <p className="text-sm text-gray-500">Confidence: {conf}%</p>}
      {entries.length > 0 && (
        <dl className="mt-2 space-y-1 text-sm">
          {entries.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="capitalize text-gray-500">{k.replace(/_/g, ' ')}</dt>
              <dd className="text-right font-medium text-gray-800">{String(v)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

export default function CaseDetail() {
  const { id } = useParams()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('New')
  const [reply, setReply] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const all = await getCases()
        const found = (Array.isArray(all) ? all : []).find((c) => String(c.id) === String(id))
        if (!active) return
        if (!found) {
          setError('Case not found.')
        } else {
          setCaseData(found)
          setStatus(found.status || 'New')
          setReply(found.expert_reply || '')
        }
      } catch (e) {
        if (active) setError('Could not load this case. Please go back and try again.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const save = async () => {
    if (!caseData) return
    setSaving(true)
    setSaved('')
    setError('')
    try {
      await updateCase(caseData.id, { status, expert_reply: reply })
      setCaseData({ ...caseData, status, expert_reply: reply })
      setSaved('Saved. The farmer will see this reply.')
    } catch (e) {
      setError('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const findings = Array.isArray(caseData?.agent_findings) ? caseData.agent_findings : []
  const phone = typeof caseData?.farmer === 'object' ? caseData?.farmer?.phone : null

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6">
          <Link to="/expert" className="text-base font-medium text-green-700 hover:underline">
            ← Back to cases
          </Link>

          {loading && (
            <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">
              Loading case...
            </div>
          )}

          {!loading && !caseData && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error || 'Case not found.'}
            </div>
          )}

          {caseData && (
            <>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-green-800">Case {String(caseData.id)}</h1>
                <StatusBadge status={caseData.status} />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* Farmer + issue */}
                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-lg font-semibold text-green-800">Farmer and issue</h2>
                  <dl className="grid grid-cols-2 gap-3 text-base">
                    <div>
                      <dt className="text-sm text-gray-500">Farmer</dt>
                      <dd className="font-medium">{farmerName(caseData)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="font-medium">{phone || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Crop</dt>
                      <dd className="font-medium">{caseData.crop || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">District</dt>
                      <dd className="font-medium">{caseData.district || '-'}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-sm text-gray-500">Symptoms</dt>
                      <dd className="font-medium">{caseData.symptoms || '-'}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-sm text-gray-500">Conversation summary</dt>
                      <dd>{caseData.summary || '-'}</dd>
                    </div>
                    <div className="col-span-2 text-sm text-gray-500">
                      Created: {formatDate(caseData.created_at)}
                    </div>
                  </dl>
                </div>

                {/* Photo */}
                <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-lg font-semibold text-green-800">Leaf photo</h2>
                  {caseData.image_url ? (
                    <img
                      src={caseData.image_url}
                      alt="Reported leaf"
                      className="max-h-72 w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                      No photo attached
                    </div>
                  )}
                </div>
              </div>

              {/* Agent findings */}
              <h2 className="mb-3 mt-6 text-lg font-semibold text-green-800">AI agent findings</h2>
              {findings.length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {findings.map((f, i) => (
                    <FindingCard key={i} f={f} />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-white p-4 text-gray-500">No agent findings recorded.</p>
              )}

              {/* Expert action */}
              <div className="mt-6 rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-green-800">Expert response</h2>
                <label className="block text-sm text-gray-600">
                  Status
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="ml-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base"
                  >
                    {['New', 'Assigned', 'Resolved'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  placeholder="Write your advice for the farmer..."
                  className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-base"
                />
                <button
                  onClick={save}
                  disabled={saving}
                  className="mt-3 rounded-full bg-green-600 px-6 py-3 text-base font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save and send reply'}
                </button>
                {saved && <p className="mt-2 text-sm text-green-700">{saved}</p>}
                {error && caseData && <p className="mt-2 text-sm text-red-700">{error}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
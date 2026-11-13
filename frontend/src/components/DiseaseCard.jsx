// Owner: Member 1
export default function DiseaseCard({ data }) {
  const disease = (data || []).find((a) => a.agent === 'disease')
  if (!disease) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
        <h3 className="font-semibold text-gray-500 flex items-center gap-2">
          <span>🌿</span> Disease Diagnostics
        </h3>
        <p className="text-sm text-gray-400 mt-2">No diagnostics yet.</p>
      </div>
    )
  }

  const label = disease.data?.label ?? disease.prediction ?? 'Unknown'
  const confidence = disease.confidence ?? disease.data?.confidence ?? 0
  const needsReview = disease.needs_expert_review ?? confidence < 0.6

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <span>🌿</span> Disease Diagnostics
      </h3>
      <p className="text-base font-medium text-gray-800 mt-2">{label}</p>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Confidence</span>
          <span>{Math.round(confidence * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              confidence >= 0.7 ? 'bg-green-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.round(confidence * 100)}%` }}
          />
        </div>
      </div>

      {needsReview && (
        <p className="mt-3 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
          ⚠️ Low confidence, expert review recommended
        </p>
      )}
    </div>
  )
}

// Owner: Member 1
const CROP_CALENDAR = {
  Cotton: { initial: 20, development: 30, mid: 40, late: 30 },
  Rice: { initial: 15, development: 25, mid: 40, late: 35 },
  Maize: { initial: 10, development: 20, mid: 35, late: 30 },
  Chilli: { initial: 15, development: 20, mid: 30, late: 25 },
  Groundnut: { initial: 20, development: 30, mid: 35, late: 25 },
  Tomato: { initial: 10, development: 20, mid: 35, late: 30 },
}

const STAGE_ADVICE = {
  Initial: 'Seedlings are establishing. Keep the soil evenly moist and watch for early pests.',
  Development: 'The crop is growing vegetatively. Apply the recommended fertilizer and keep weeds in check.',
  Mid: 'This is the peak growth stage. Maintain irrigation and scout leaves for spots or pests.',
  Late: 'The crop is maturing. Ease off irrigation and prepare for harvest.',
}

export default function GrowthStageCard({ farmer }) {
  const crop = farmer?.crop ?? "Cotton"
  const sowingDateStr = farmer?.sowing_date ?? "2026-06-15"
  const sowingDate = new Date(sowingDateStr)
  const today = new Date()
  const daysSinceSowing = Math.max(0, Math.floor((today - sowingDate) / (1000 * 60 * 60 * 24)))

  const calendar = CROP_CALENDAR[crop] || CROP_CALENDAR.Cotton
  const total = (calendar?.initial ?? 20) + (calendar?.development ?? 30) + (calendar?.mid ?? 40) + (calendar?.late ?? 30)
  const elapsed = daysSinceSowing
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))

  let stage = 'Initial'

  if (elapsed < (calendar?.initial ?? 20)) {
    stage = 'Initial'
  } else if (elapsed < (calendar?.initial ?? 20) + (calendar?.development ?? 30)) {
    stage = 'Development'
  } else if (elapsed < (calendar?.initial ?? 20) + (calendar?.development ?? 30) + (calendar?.mid ?? 40)) {
    stage = 'Mid'
  } else {
    stage = 'Late'
  }

  const advice = STAGE_ADVICE[stage]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
        <span>🌱</span> Growth Stage
      </h3>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            progress >= 50 ? 'bg-green-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm text-gray-500 mb-2">
        Days since sowing: {daysSinceSowing}
      </div>
      <p className="font-medium text-gray-700">{stage}</p>
      <p className="text-xs text-gray-500">{advice}</p>
      <select
        className="mt-2 w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
        defaultValue={stage}
        onChange={() => {}}
      >
        <option value="Initial">Initial</option>
        <option value="Development">Development</option>
        <option value="Mid">Mid</option>
        <option value="Late">Late</option>
      </select>
    </div>
  )
}

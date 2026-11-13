// Owner: Member 1
// Map of Telangana with one dot per case. Groups of 3+ similar cases get a red circle.
import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'

// Approximate district centers [latitude, longitude]
const DISTRICT_COORDS = {
  Hyderabad: [17.385, 78.487],
  Rangareddy: [17.25, 78.1],
  Vikarabad: [17.34, 77.9],
  Sangareddy: [17.62, 78.08],
  Medak: [18.05, 78.26],
  Siddipet: [18.1, 78.85],
  Kamareddy: [18.32, 78.34],
  Nizamabad: [18.67, 78.09],
  Nirmal: [19.1, 78.34],
  Adilabad: [19.67, 78.53],
  Mancherial: [18.87, 79.46],
  Jagtial: [18.79, 78.91],
  Karimnagar: [18.44, 79.13],
  Warangal: [17.97, 79.6],
  Khammam: [17.25, 80.15],
  Suryapet: [17.14, 79.62],
  Nalgonda: [17.05, 79.27],
  Mahabubnagar: [16.74, 77.99],
  Nagarkurnool: [16.48, 78.32],
  Wanaparthy: [16.36, 78.06],
}

const STATUS_COLORS = { new: '#dc2626', assigned: '#d97706', resolved: '#16a34a' }

// Groups similar symptoms so "yellow spots" and "leaf spot" count as the same issue
const ISSUE_GROUPS = [
  { name: 'leaf spots / yellowing', words: ['yellow', 'spot', 'blight', 'lesion', 'fung'] },
  { name: 'wilting', words: ['wilt', 'droop', 'wither'] },
  { name: 'leaf curl', words: ['curl', 'twist'] },
  { name: 'pest damage', words: ['pest', 'worm', 'aphid', 'hopper', 'insect', 'bite', 'whitefly'] },
  { name: 'mildew / rust', words: ['rust', 'mildew', 'powder'] },
]

const issueOf = (c) => {
  const text = String(c?.symptoms || c?.summary || '').toLowerCase()
  const g = ISSUE_GROUPS.find((grp) => grp.words.some((w) => text.includes(w)))
  return g ? g.name : 'other'
}

// Small fixed offset so several cases in one district don't sit on top of each other
const positionOf = (c, index) => {
  if (typeof c.latitude === 'number' && typeof c.longitude === 'number') {
    return [c.latitude, c.longitude]
  }
  const base = DISTRICT_COORDS[c.district]
  if (!base) return null
  const angle = index * 2.4
  const r = 0.06 * (1 + (index % 3) * 0.5)
  return [base[0] + Math.sin(angle) * r, base[1] + Math.cos(angle) * r]
}

// Distance in km between two [lat, lng] points
const km = (a, b) => {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

export default function RegionMap({ cases = [] }) {
  const placed = useMemo(
    () =>
      cases
        .map((c, i) => ({ ...c, pos: positionOf(c, i) }))
        .filter((c) => c.pos),
    [cases]
  )

  const clusters = useMemo(() => {
    const groups = {}
    placed.forEach((c) => {
      const issue = issueOf(c)
      if (issue === 'other') return
      const key = `${c.crop || 'Crop'}|${issue}`
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    })
    return Object.entries(groups)
      .filter(([, list]) => list.length >= 3)
      .map(([key, list]) => {
        const [crop, issue] = key.split('|')
        const lat = list.reduce((s, c) => s + c.pos[0], 0) / list.length
        const lng = list.reduce((s, c) => s + c.pos[1], 0) / list.length
        const center = [lat, lng]
        const spread = Math.max(...list.map((c) => km(center, c.pos)))
        return {
          key,
          crop,
          issue,
          center,
          radius: Math.max(30, spread + 15) * 1000, // metres
          districts: Array.from(new Set(list.map((c) => c.district))),
          count: list.length,
        }
      })
  }, [placed])

  const hasDemo = cases.some((c) => c.is_demo)
  const missing = cases.length - placed.length

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-green-800">🗺 Regional Issue Map</h2>
        {hasDemo && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
            Demo data
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-600">
        {Object.entries(STATUS_COLORS).map(([name, color]) => (
          <span key={name} className="flex items-center gap-1 capitalize">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
            {name}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-red-600" />
          Possible regional pattern
        </span>
      </div>

      <div className="relative z-0 overflow-hidden rounded-xl">
        <MapContainer
          center={[17.9, 79.0]}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: '420px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {clusters.map((cl) => (
            <Circle
              key={cl.key}
              center={cl.center}
              radius={cl.radius}
              pathOptions={{ color: '#dc2626', weight: 2, fillColor: '#dc2626', fillOpacity: 0.12 }}
            />
          ))}

          {placed.map((c) => (
            <CircleMarker
              key={c.id}
              center={c.pos}
              radius={9}
              pathOptions={{
                color: '#ffffff',
                weight: 2,
                fillColor: STATUS_COLORS[String(c.status || '').toLowerCase()] || '#6b7280',
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">
                    Case {String(c.id)} · {c.crop || 'Crop'}
                  </p>
                  <p>{c.district}</p>
                  <p>{c.symptoms || c.summary || '-'}</p>
                  <p>Status: {c.status}</p>
                  <Link to={`/expert/case/${c.id}`} className="font-medium text-green-700 underline">
                    Open case
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Cluster summary */}
      <div className="mt-4">
        <h3 className="mb-2 text-base font-semibold text-gray-800">Possible regional patterns</h3>
        {clusters.length ? (
          <ul className="space-y-2">
            {clusters.map((cl) => (
              <li key={cl.key} className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                <span className="font-semibold">
                  {cl.count} {cl.crop} cases with {cl.issue}
                </span>{' '}
                in {cl.districts.join(', ')}. An expert should investigate whether this is spreading.
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No repeated patterns yet. A pattern appears when 3 or more cases of the same crop and
            issue are reported.
          </p>
        )}
        {missing > 0 && (
          <p className="mt-2 text-xs text-gray-400">
            {missing} case(s) are not shown because their district has no map location.
          </p>
        )}
      </div>
    </div>
  )
}
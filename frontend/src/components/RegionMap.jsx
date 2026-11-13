// Owner: Member 1 - 
import { useLanguage } from '../context/LanguageContext'

export default function RegionMap({ cases }) {
  const { lang } = useLanguage()
  return (
    <div className="h-96 border rounded bg-gray-100">
      <h3 className="font-semibold text-gray-800 p-2">
        Region Map ({lang === 'te' && 'à°šå€åŸŸ à°šà°¿à°¤à±à°°à°‚'})
      </h3>
      <p className="text-sm text-gray-500 p-4">Leaflet map placeholder - renders Telangana districts</p>
    </div>
  )
}

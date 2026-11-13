// Owner: Member 1 - 
import { useLanguage } from '../context/LanguageContext'
import { Link } from 'react-router-dom'
export default function CaseDetail() {
  const { lang } = useLanguage()
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {lang === 'te' && 'à°•à±‡à°¸à± à¨µà®¿à®µà°°à°£'}
        {lang === 'hi' && 'à¤•à¥‡à¤¸ à¤µà¤¿à¤µà¤°à¤£'}
        {lang === 'en' && 'Case Detail'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="font-medium text-gray-600">Farmer</p>
          <p className="mt-1">{lang === 'te' && 'F101 - Ramesh Rao'} {lang === 'hi' && 'F101 - à¤°à¤®à¥‡à¤¶ à¤°à¤¾à¤µ'} {lang === 'en' && 'Farmer F101'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600">Crop</p>
          <p className="mt-1">Cotton</p>
        </div>
        <div>
          <p className="font-medium text-gray-600">Status</p>
          <p className="mt-1 text-green-600">New</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-medium text-gray-800">
          {lang === 'te' && 'Agent Findings'}
          {lang === 'hi' && 'à¤à¤œà¥‡à¤‚à¤Ÿ à¤¨à¤¿à¤·à¥à¤•à¤°à¥à¤·'}
          {lang === 'en' && 'Agent Findings'}
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold text-green-700">Disease:</span> Bacterial Leaf Blight
          </li>
          <li>
            <span className="font-semibold text-blue-700">Weather:</span> High humidity favorable
          </li>
          <li>
            <span className="font-semibold text-cyan-700">Irrigation:</span> 3.5 mm/day
          </li>
          <li>
            <span className="font-semibold text-amber-700">Yield:</span> 22.4 q/ha
          </li>
          <li>
            <span className="font-semibold text-emerald-700">Market:</span> â‚¹7,250/q
          </li>
        </ul>
      </div>
      <div className="mt-6">
        <Link to="/" className="text-blue-600">Back to Farmer</Link>
        <Link to="/expert" className="text-blue-600 ml-2">Back to Dashboard</Link>
      </div>
    </div>
  )
}

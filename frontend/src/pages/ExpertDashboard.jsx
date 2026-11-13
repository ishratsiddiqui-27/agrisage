// Owner: Member 1 - 
import { useLanguage } from '../context/LanguageContext'
import { Link } from 'react-router-dom'
import CaseTable from '../components/CaseTable'

export default function ExpertDashboard({ agents = [] }) {
  const { lang } = useLanguage()
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {lang === 'te' && 'Experts Dashboard'}
        {lang === 'hi' && 'à¤à¤•à¥à¤¸à¤ªà¤°à¥à¤Ÿ à¤¡à¥ˆà¤¶à¤¬à¥‹à¤°à¥à¤¡'}
        {lang === 'en' && 'Expert Dashboard'}
      </h1>
      <p className="text-gray-600 mb-4">
        {lang === 'en' && 'Overview of cases and agent activity'}
      </p>
      <div className="space-y-4">
        <div className="border rounded bg-gray-50 p-4">
          <h3 className="font-medium mb-2">
            {lang === 'te' && 'All Cases'}
            {lang === 'hi' && 'à¤¸à¤­à¥€ à¤•à¥‡à¤¸'}
            {lang === 'en' && 'All Cases'}
          </h3>
          <CaseTable cases={[
            { id: 1, farmer: 'F101 - Ramesh Rao', crop: 'Cotton', status: 'New' },
            { id: 2, farmer: 'F102 - Anji Reddy', crop: 'Rice', status: 'Assigned' },
            { id: 3, farmer: 'F103 - Venkatesh', crop: 'Chilli', status: 'Resolved' },
            { id: 4, farmer: 'F104 - Sammaiah', crop: 'Maize', status: 'New' },
            { id: 5, farmer: 'F105 - Laxman', crop: 'Groundnut', status: 'Assigned' }
          ]} />
        </div>
        <div className="border rounded bg-gray-50 p-4">
          <h3 className="font-medium mb-2">
            {lang === 'te' && 'Agent Activity Feed'}
            {lang === 'hi' && 'à¤à¤œà¥‡à¤‚à¤Ÿ à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿ à¤«à¤¼à¥€à¤¡'}
            {lang === 'en' && 'Agent Activity Feed'}
          </h3>
          <div>
            {agents.map(a => (
              <div key={a.agent} className="p-2 border-b">
                <span className="font-medium">{a.agent}: {a.prediction}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Link to="/" className="mt-4 text-blue-600">Back to Farmer</Link>
    </div>
  )
}

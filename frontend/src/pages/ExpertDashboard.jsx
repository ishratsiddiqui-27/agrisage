// Owner: Member 1
import { Link } from 'react-router-dom'
import CaseTable from '../components/CaseTable'
import ErrorBoundary from '../components/ErrorBoundary'

export default function ExpertDashboard({ agents = [] }) {
  return (
    <ErrorBoundary>
      <div className="p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Expert Dashboard
        </h1>
        <p className="text-gray-600 mb-4">Review expert cases and agent activity.</p>
        <div className="space-y-4">
          <div className="border rounded bg-gray-50 p-4">
            <h3 className="font-medium mb-2">
              All Cases
            </h3>
            <ErrorBoundary>
              <CaseTable cases={[
                { id: 1, farmer: 'F101 - Ramesh Rao', crop: 'Cotton', status: 'New' },
                { id: 2, farmer: 'F102 - Anji Reddy', crop: 'Rice', status: 'Assigned' },
                { id: 3, farmer: 'F103 - Venkatesh', crop: 'Chilli', status: 'Resolved' },
                { id: 4, farmer: 'F104 - Sammaiah', crop: 'Maize', status: 'New' },
                { id: 5, farmer: 'F105 - Laxman', crop: 'Groundnut', status: 'Assigned' }
              ]} />
            </ErrorBoundary>
          </div>
          <div className="border rounded bg-gray-50 p-4">
            <h3 className="font-medium mb-2">
              Agent Activity
            </h3>
            <div>
              {(agents || []).map(a => (
                <div key={a?.agent ?? Math.random()} className="p-2 border-b">
                  <span className="font-medium">{a?.agent ?? 'agent'}: {a?.prediction ?? ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link to="/" className="mt-4 inline-block text-blue-600">Back to Farmer</Link>
      </div>
    </ErrorBoundary>
  )
}

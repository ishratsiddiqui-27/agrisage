// Owner: Member 1
import { Link } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

export default function CaseDetail() {
  return (
    <ErrorBoundary>
      <div className="p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Case Detail
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-medium text-gray-600">Farmer</p>
            <p className="mt-1">F101 - Ramesh Rao</p>
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
            Agent Activity
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
              <span className="font-semibold text-emerald-700">Market:</span> ₹7,250/q
            </li>
          </ul>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Back to Farmer</Link>
          <Link to="/expert" className="text-blue-600 hover:underline">Expert Dashboard</Link>
        </div>
      </div>
    </ErrorBoundary>
  )
}

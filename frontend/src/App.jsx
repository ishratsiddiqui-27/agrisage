// Owner: Member 1 - 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Farmer from './pages/Farmer'
import ExpertDashboard from './pages/ExpertDashboard'
import CaseDetail from './pages/CaseDetail'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Farmer />} />
              <Route path="/expert" element={<ExpertDashboard />} />
              <Route path="/expert/case/:id" element={<CaseDetail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}

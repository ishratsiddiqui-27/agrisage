// Owner: Member 1
import { useState } from 'react'
import { useFarmer } from '../context/FarmerContext'
import Chat from '../components/Chat'
import WeatherCard from '../components/WeatherCard'
import IrrigationCard from '../components/IrrigationCard'
import DiseaseCard from '../components/DiseaseCard'
import YieldCard from '../components/YieldCard'
import MarketCard from '../components/MarketCard'
import FarmerForm from '../components/FarmerForm'
import GrowthStageCard from '../components/GrowthStageCard'
import ErrorBoundary from '../components/ErrorBoundary'

export default function Farmer() {
  const [reply, setReply] = useState(null)
  const { profile, setProfile, loading, error, fetchInsights } = useFarmer()

  // Pick agent outputs from the reply; fall back to the agentResponses mock.
  const agents = (reply && reply.agents && reply.agents.length) ? reply.agents : null

  const handleReply = (newReply) => setReply(newReply)

  const handleFetch = async () => {
    await fetchInsights(profile)
    setReply(null)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* LEFT: Chat area */}
            <div className="lg:w-1/2 xl:w-3/5 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-3">
                {/* VoiceCall goes here (Step 4) */}
                <div className="border-2 border-dashed border-green-300 rounded-xl p-3 text-center text-sm text-green-500 mb-3">
                  VoiceCall goes here (Step 4)
                </div>
                {/* ImageUpload goes here (Step 5) */}
                <div className="border-2 border-dashed border-green-300 rounded-xl p-3 text-center text-sm text-green-500 mb-3">
                  ImageUpload goes here (Step 5)
                </div>
                <ErrorBoundary>
                  <Chat onReply={handleReply} />
                </ErrorBoundary>
              </div>
            </div>

            {/* RIGHT: Farm Insights panel */}
            <div className="lg:w-1/2 xl:w-2/5 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-4">
                <h2 className="text-lg font-bold text-green-800 mb-3">
                  Farmer Profile
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name</span>
                    <p className="font-medium text-gray-800">{profile?.name ?? 'Ramesh'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">District</span>
                    <p className="font-medium text-gray-800">{profile?.district ?? profile?.location ?? 'Nizamabad'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Crop</span>
                    <p className="font-medium text-gray-800">{profile?.crop ?? 'Cotton'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Growth Stage</span>
                    <p className="font-medium text-gray-800">{profile?.growth_stage ?? 'Flowering'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <ErrorBoundary><GrowthStageCard farmer={profile} /></ErrorBoundary>
                <ErrorBoundary><WeatherCard data={agents} /></ErrorBoundary>
                <ErrorBoundary><IrrigationCard data={agents} /></ErrorBoundary>
                <ErrorBoundary><DiseaseCard data={agents} /></ErrorBoundary>
                <ErrorBoundary><YieldCard data={agents} /></ErrorBoundary>
                <ErrorBoundary><MarketCard data={agents} /></ErrorBoundary>
              </div>

              {/* Farmer Form - collapsible */}
              <ErrorBoundary>
                <FarmerForm farmer={profile} onSubmit={handleFetch} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

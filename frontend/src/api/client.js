// Owner: Member 1 - Ishrat
// AgriSage AI API client.
// Reads VITE_API_URL from the environment; falls back to mock data when
// VITE_USE_MOCK=true so the UI works without the backend running.

import * as mock from '../mock/index'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

async function _req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`)
  return res.json()
}

export async function sendVoice(audioBlob, language, farmerId, crop) {
  if (USE_MOCK) return mock.voiceResponse
  const fd = new FormData()
  fd.append('audio', audioBlob, 'recording.webm')
  fd.append('language', language)
  fd.append('farmer_id', farmerId)
  fd.append('crop', crop || 'cotton')
  const res = await fetch(`${BASE}/api/voice`, { method: 'POST', body: fd })
  return res.json()
}

export async function sendText(query, language, farmerId, crop) {
  if (USE_MOCK) return { ...mock.voiceResponse, transcript: query }
  return _req('POST', '/api/text', { query, language, farmer_id: farmerId, crop })
}

export async function uploadImage(imageFile, language, farmerId, crop) {
  if (USE_MOCK) return mock.voiceResponse
  const fd = new FormData()
  fd.append('image', imageFile)
  fd.append('language', language)
  fd.append('farmer_id', farmerId)
  fd.append('crop', crop || 'cotton')
  const res = await fetch(`${BASE}/api/image`, { method: 'POST', body: fd })
  return res.json()
}

export async function getCases(status) {
  if (USE_MOCK) return status ? mock.cases.filter(c => c.status === status) : mock.cases
  const url = status ? `/api/cases?status=${encodeURIComponent(status)}` : '/api/cases'
  return _req('GET', url)
}

export async function getCase(id) {
  if (USE_MOCK) return mock.cases.find(c => c.id === id) || mock.cases[0]
  return _req('GET', `/api/cases/${id}`)
}

export async function updateCase(id, payload) {
  if (USE_MOCK) {
    const c = mock.cases.find(x => x.id === id)
    if (c) Object.assign(c, payload)
    return c
  }
  return _req('PATCH', `/api/cases/${id}`, payload)
}

export async function getAgentActivity(caseId) {
  if (USE_MOCK) return { case_id: caseId, steps: mock.agentResponses }
  return _req('GET', `/api/agent-activity/${caseId}`)
}
// Owner: Member 1
// AgriSage AI API client.
// Reads VITE_API_URL from the environment; falls back to mock data when
// VITE_USE_MOCK=true (or the demo switch is on) so the UI works without the backend.

import * as mock from '../mock/index'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const ENV_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Demo-data switch: a saved browser choice wins over the .env value
export const getMockMode = () => {
  try {
    const v = localStorage.getItem('agrisage_mock')
    if (v !== null) return v === 'true'
  } catch (e) {}
  return ENV_MOCK
}
export const setMockMode = (on) => {
  try {
    localStorage.setItem('agrisage_mock', String(on))
  } catch (e) {}
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const getMockDelay = () => Math.floor(Math.random() * 401) + 600 // 600 - 1000 ms

async function _req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`)
  return res.json()
}

export async function checkHealth() {
  if (getMockMode()) {
    await delay(getMockDelay())
    return { status: 'ok' }
  }
  return _req('GET', '/api/health')
}

export async function sendVoice(audioBlob, language = 'en', farmerId, crop) {
  if (getMockMode()) {
    await delay(getMockDelay())
    return mock.voiceResponse
  }
  const fd = new FormData()
  fd.append('audio', audioBlob, 'recording.webm')
  fd.append('language', language)
  fd.append('farmer_id', farmerId || 'F101')
  fd.append('crop', crop || 'Cotton')
  const res = await fetch(`${BASE}/api/voice`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(`POST /api/voice failed: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function sendText(query, language = 'en', farmerId, crop) {
  if (getMockMode()) {
    await delay(getMockDelay())
    return { ...mock.voiceResponse, transcript: query }
  }
  return _req('POST', '/api/text', { query, language, farmer_id: farmerId || 'F101', crop })
}

export async function uploadImage(imageFile, language = 'en', farmerId, crop) {
  if (getMockMode()) {
    await delay(getMockDelay())
    return mock.voiceResponse
  }
  const fd = new FormData()
  fd.append('image', imageFile)
  fd.append('language', language)
  fd.append('farmer_id', farmerId || 'F101')
  fd.append('crop', crop || 'Cotton')
  const res = await fetch(`${BASE}/api/image`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(`POST /api/image failed: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function getCases(status) {
  if (getMockMode()) {
    await delay(getMockDelay())
    return status ? mock.cases.filter((c) => c.status === status) : mock.cases
  }
  const url = status ? `/api/cases?status=${encodeURIComponent(status)}` : '/api/cases'
  return _req('GET', url)
}

export async function getCase(id) {
  if (getMockMode()) {
    await delay(getMockDelay())
    return mock.cases.find((c) => String(c.id) === String(id)) || mock.cases[0]
  }
  return _req('GET', `/api/cases/${id}`)
}

export async function updateCase(id, payload) {
  if (getMockMode()) {
    await delay(getMockDelay())
    const c = mock.cases.find((x) => String(x.id) === String(id))
    if (c) Object.assign(c, payload)
    return c
  }
  return _req('PATCH', `/api/cases/${id}`, payload)
}

export async function getAgentActivity(caseId) {
  if (getMockMode()) {
    await delay(getMockDelay())
    return { case_id: caseId, steps: mock.agentResponses }
  }
  return _req('GET', `/api/agent-activity/${caseId}`)
}
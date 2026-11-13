// Owner: Member 1
import React, { useState } from 'react'
import { useFarmer } from '../context/FarmerContext'
import { districts } from '../mock/index'

const CROPS = ['Cotton', 'Rice', 'Maize', 'Chilli', 'Groundnut', 'Tomato']

export default function FarmerForm({ onSubmit }) {
  const { farmer, setProfile } = useFarmer()
  const [open, setOpen] = useState(true)
  const [form, setForm] = useState({
    location: farmer.district,
    crop: farmer.crop,
    sowing_date: farmer.sowing_date || '',
    nitrogen: farmer.soil?.nitrogen ?? 80,
    phosphorus: farmer.soil?.phosphorus ?? 45,
    potassium: farmer.soil?.potassium ?? 40,
    ph: farmer.soil?.ph ?? 6.8,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value === '' ? '' : (e.target.type === 'number' ? parseFloat(value) : value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updated = {
      ...farmer,
      district: form.location,
      crop: form.crop,
      sowing_date: form.sowing_date,
      soil: {
        ...farmer.soil,
        nitrogen: form.nitrogen,
        phosphorus: form.phosphorus,
        potassium: form.potassium,
        ph: form.ph,
      },
    }
    setProfile(updated)
    if (onSubmit) await onSubmit(updated)
  }

  return (
    <div className="lg:mt-0 mt-6 bg-white rounded-2xl shadow-sm border border-green-100 p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2 text-sm font-medium text-green-700 hover:text-green-800"
      >
        <span>{open ? 'Collapse Form' : 'Expand Form'}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">
              District
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              {districts.map((d) => (
                <option key={d.district} value={d.district}>{d.district}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">
              Crop
            </label>
            <select
              name="crop"
              value={form.crop}
              onChange={handleChange}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">
              Sowing Date
            </label>
            <input
              type="date"
              name="sowing_date"
              value={form.sowing_date || ''}
              onChange={handleChange}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Nitrogen
              </label>
              <input
                type="number"
                name="nitrogen"
                value={form.nitrogen}
                onChange={handleChange}
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Phosphorus
              </label>
              <input
                type="number"
                name="phosphorus"
                value={form.phosphorus}
                onChange={handleChange}
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Potassium
              </label>
              <input
                type="number"
                name="potassium"
                value={form.potassium}
                onChange={handleChange}
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                pH
              </label>
              <input
                type="number"
                name="ph"
                value={form.ph}
                onChange={handleChange}
                step="0.1"
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Get Insights
          </button>
        </form>
      )}
    </div>
  )
}
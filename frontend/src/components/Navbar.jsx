// Owner: Member 1 - Ishrat
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useState } from 'react'

export default function Navbar() {
  const { lang, setLanguage, languages } = useLanguage()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-green-100 text-green-800'
        : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
    }`

  return (
    <nav className="bg-white border-b border-green-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-green-700">AgriSage AI</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={linkClass('/')}>Farmer</Link>
            <Link to="/expert" className={linkClass('/expert')}>Expert Dashboard</Link>
          </div>

          {/* Language dropdown (desktop) */}
          <div className="hidden md:block relative">
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-green-50 border border-green-300 text-green-800 text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {Object.entries(languages).map(([code, info]) => (
                <option key={code} value={code}>{info.native}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-green-600">▾</span>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-700 hover:bg-green-50"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open menu</span>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-green-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={linkClass('/')}>Farmer</Link>
            <Link to="/expert" className={linkClass('/expert')}>Expert Dashboard</Link>
          </div>
          <div className="px-4 pb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-green-50 border border-green-300 text-green-800 text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {Object.entries(languages).map(([code, info]) => (
                <option key={code} value={code}>{info.native}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </nav>
  )
}
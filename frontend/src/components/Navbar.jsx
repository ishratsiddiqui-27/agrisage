// Owner: Member 1
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
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
            <Link to="/expert" className={linkClass('/expert')}>Expert</Link>
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
    </nav>
  )
}

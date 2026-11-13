import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-2xl shadow-sm border border-red-100 bg-red-50">
          <p className="text-sm text-red-800">This section could not load.</p>
        </div>
      )
    }

    return this.props.children
  }
}

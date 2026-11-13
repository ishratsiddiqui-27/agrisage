// Owner: Member 1
// Leaf photo upload: choose / drag-drop / take photo -> preview -> analyze -> result.
import { useState, useRef, useEffect } from 'react'
import { useFarmer } from '../context/FarmerContext'
import { uploadImage } from '../api/client'

const MAX_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Finds the disease agent's output inside the backend reply
const findDisease = (data) => {
  const list = Array.isArray(data?.agents) ? data.agents : []
  return list.find((a) => String(a?.agent || '').toLowerCase().includes('disease')) || null
}

export default function ImageUpload({ onResult }) {
  // Works whether the context returns { farmer } or { profile }
  const ctx = useFarmer()
  const farmer = ctx?.farmer ?? ctx?.profile ?? {}
  const farmerId = farmer.farmer_id || 'F101'
  const crop = farmer.crop || 'Cotton'

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const cameraRef = useRef(null)

  // Free the preview URL when it changes or the component closes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const selectFile = (f) => {
    setError('')
    setResult(null)
    if (!f) return
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Please choose a JPG, PNG or WebP image.')
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`That image is too large. Please choose one under ${MAX_MB} MB.`)
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const clearAll = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const data = await uploadImage(file, 'en', farmerId, crop)
      setResult(data)
      if (onResult) onResult(data) // updates the cards on the Farmer page
    } catch (e) {
      setError('Could not analyze the image. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    selectFile(e.dataTransfer.files?.[0])
  }

  // Disease result details
  const disease = result ? findDisease(result) : null
  const label = disease?.prediction || disease?.data?.label || disease?.data?.disease || null
  const rawConf = typeof disease?.confidence === 'number' ? disease.confidence : null
  const percent = rawConf === null ? null : Math.round(rawConf <= 1 ? rawConf * 100 : rawConf)
  const lowConfidence =
    disease && (disease.needs_expert_review === true || (percent !== null && percent < 60))

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-green-800">Leaf Photo Check</h2>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-4 text-center transition ${
          dragging ? 'border-green-600 bg-green-50' : 'border-green-300'
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Selected leaf"
            className="mx-auto max-h-56 rounded-lg object-contain"
          />
        ) : (
          <p className="text-base text-gray-500">
            Drag a leaf photo here, or use the buttons below
          </p>
        )}
      </div>

      {/* Hidden inputs */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => selectFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => selectFile(e.target.files?.[0])}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-green-50 px-4 py-2 text-base font-medium text-green-800 hover:bg-green-100"
        >
          📁 Choose photo
        </button>
        <button
          onClick={() => cameraRef.current?.click()}
          className="rounded-full bg-green-50 px-4 py-2 text-base font-medium text-green-800 hover:bg-green-100"
        >
          📷 Take photo
        </button>
        {file && (
          <button
            onClick={clearAll}
            className="rounded-full px-4 py-2 text-base text-gray-500 underline"
          >
            Clear
          </button>
        )}
      </div>

      {file && (
        <button
          onClick={analyze}
          disabled={loading}
          className="mt-3 w-full rounded-full bg-green-600 py-3 text-lg font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze leaf'}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>
          {file && !loading && (
            <button
              onClick={analyze}
              className="mt-2 rounded-full bg-red-600 px-3 py-1 text-white"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Result */}
      {result && !error && (
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          {disease ? (
            <>
              <p className="text-sm text-gray-500">Possible issue</p>
              <p className="text-xl font-bold text-gray-800">{label || 'Result received'}</p>
              {percent !== null && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Confidence</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${
                        percent >= 60 ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {lowConfidence && (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">
                  ⚠ Low confidence. Expert review recommended.
                </p>
              )}
            </>
          ) : (
            <p className="text-base text-gray-700">
              Analysis complete. See the Disease Detection card for the result.
            </p>
          )}
          {result.reply_text && (
            <p className="mt-3 text-base text-gray-700">{result.reply_text}</p>
          )}
        </div>
      )}
    </div>
  )
}
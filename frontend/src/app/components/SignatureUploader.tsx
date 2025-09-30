'use client'

import { useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'

export default function SignatureVerifier() {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw')
  const [original, setOriginal] = useState<File | null>(null)
  const [test, setTest] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const sigCanvasRef = useRef<SignatureCanvas>(null)

  const handleCompare = async () => {
    if (!original) return alert('Upload original signature!')

    const formData = new FormData()
    formData.append('original', original)

    if (mode === 'upload') {
      if (!test) return alert('Upload test signature!')
      formData.append('test', test)
    } else {
      const drawn = sigCanvasRef.current?.toDataURL()
      const blob = await (await fetch(drawn!)).blob()
      formData.append('test', new File([blob], 'drawn.png', { type: 'image/png' }))
    }

    try {
      setLoading(true)
      setResult(null)

      const res = await fetch("https://signature-recognition-0n3m.onrender.com/api/verify", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      const score = data.match_score
      const matched = score >= 50

      setResult(`${score}% - ${matched ? '✅ Match' : '❌ No Match'}`)
    } catch (err) {
      setResult('❌ Error verifying signature')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-50 rounded-3xl shadow-2xl space-y-6 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 tracking-wide">
        🕵️ Forensic Handwriting Analysis
      </h1>

      {/* Mode Selector */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Test Signature Input Method</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'draw' | 'upload')}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="draw">✍️ Draw Test Signature</option>
          <option value="upload">📁 Upload Test Signature</option>
        </select>
      </div>

      {/* Upload Original Signature */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Original Signature</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setOriginal(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Draw or Upload Test Signature */}
      {mode === 'draw' ? (
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Draw Test Signature</label>
          <div className="border rounded-xl overflow-hidden shadow-inner bg-white">
            <SignatureCanvas
              ref={sigCanvasRef}
              penColor="black"
              canvasProps={{ width: 320, height: 160, className: 'bg-white' }}
            />
          </div>
          <button
            onClick={() => sigCanvasRef.current?.clear()}
            className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium transition"
          >
            🧹 Clear
          </button>
        </div>
      ) : (
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Upload Test Signature</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setTest(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      )}

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white transition ${
          loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? '⏳ Verifying...' : '🔍 Compare Signatures'}
      </button>

      {/* Result */}
      {result && (
        <div className="text-center text-lg font-semibold text-gray-800 mt-3 border-t pt-3 border-gray-200">
          {result}
        </div>
      )}
    </div>
  )
}
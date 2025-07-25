'use client'

import { useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import axios from 'axios'

export default function SignatureVerifier() {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw')
  const [original, setOriginal] = useState<File | null>(null)
  const [test, setTest] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const sigCanvasRef = useRef<SignatureCanvas>(null)

  const handleCompare = async () => {
    const formData = new FormData()

    if (!original) return alert("Upload original signature!")

    formData.append('original', original)

    if (mode === 'upload') {
      if (!test) return alert("Upload test signature!")
      formData.append('test', test)
    } else {
      const drawn = sigCanvasRef.current?.toDataURL()
      const blob = await (await fetch(drawn!)).blob()
      formData.append('test', new File([blob], 'drawn.png', { type: 'image/png' }))
    }

    try {
      const res = await axios.post(
        'https://your-backend-api-url.com/verify',
        formData
      )
      setResult(res.data.match ? "✅ Match" : "❌ No Match")
    } catch (err) {
      setResult("❌ Error verifying signature")
    }
  }

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center">Signature Verification</h1>

      {/* Toggle Input */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as 'draw' | 'upload')}
        className="w-full p-2 border rounded"
      >
        <option value="draw">✍️ Draw Test Signature</option>
        <option value="upload">📁 Upload Test Signature</option>
      </select>

      {/* Original Upload */}
      <div>
        <label className="block font-semibold">Original Signature</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setOriginal(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      {/* Drawing Pad or Upload */}
      {mode === 'draw' ? (
        <div>
          <label className="block font-semibold">Draw Test Signature</label>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{ width: 300, height: 150, className: 'border rounded' }}
          />
          <button
            onClick={() => sigCanvasRef.current?.clear()}
            className="mt-2 px-2 py-1 bg-gray-300 text-sm rounded"
          >
            Clear
          </button>
        </div>
      ) : (
        <div>
          <label className="block font-semibold">Upload Test Signature</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setTest(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
      )}

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        Compare Signatures
      </button>

      {result && <p className="text-center font-semibold">{result}</p>}
    </div>
  )
}
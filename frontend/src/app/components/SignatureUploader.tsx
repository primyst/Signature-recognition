'use client'

import { useState } from 'react'
import axios from 'axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function ForensicHandwritingDashboard() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [testFile, setTestFile] = useState<File | null>(null)
  const [matchScore, setMatchScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const COLORS = ['#00FFFF', '#555555']

  const handleCompare = async () => {
    if (!originalFile || !testFile) {
      setErrorMsg('Please upload both handwriting samples.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setMatchScore(null)

    const formData = new FormData()
    formData.append('original', originalFile)
    formData.append('test', testFile)

    try {
      const res = await axios.post('http://localhost:5000/api/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMatchScore(res.data.match_score)
    } catch (err) {
      setErrorMsg('Error contacting the verification server.')
    } finally {
      setLoading(false)
    }
  }

  // Create a simple line chart to visualize score trend or randomness
  const lineData = Array.from({ length: 10 }, (_, i) => ({
    line: i + 1,
    value: matchScore ? matchScore - Math.random() * 10 : Math.random() * 100,
  }))

  const pieData = matchScore
    ? [
        { name: 'Match', value: matchScore },
        { name: 'Difference', value: 100 - matchScore },
      ]
    : [
        { name: 'Match', value: 0 },
        { name: 'Difference', value: 100 },
      ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide">
          🕵️ Forensic Handwriting Dashboard
        </h1>
        <div className="text-gray-400">Lab Interface</div>
      </header>

      {/* Main Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Panel */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Original Sample</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setOriginalFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
          />
          {originalFile && (
            <img
              src={URL.createObjectURL(originalFile)}
              alt="Original sample"
              className="rounded-xl border border-gray-700 mt-2"
            />
          )}
        </div>

        {/* Upload Test Panel */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Test Sample</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setTestFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
          />
          {testFile && (
            <img
              src={URL.createObjectURL(testFile)}
              alt="Test sample"
              className="rounded-xl border border-gray-700 mt-2"
            />
          )}
        </div>

        {/* Result Panel */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Results</h2>
          <div className="flex-1 flex flex-col justify-center items-center text-gray-100 text-lg font-mono">
            {loading ? (
              <p className="text-cyan-400">Analyzing handwriting...</p>
            ) : matchScore !== null ? (
              <>
                <p
                  className={`mb-4 text-2xl font-bold ${
                    matchScore >= 70 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  Match Score: {matchScore}%
                </p>
                <p className="text-gray-400 mb-4">
                  {matchScore >= 70
                    ? '✅ Likely written by the same person'
                    : '❌ Possibly different handwriting samples'}
                </p>
              </>
            ) : (
              <p className="text-gray-400">Awaiting comparison...</p>
            )}

            {/* Line Chart */}
            <div className="w-full h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                  <XAxis dataKey="line" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#00FFFF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="w-32 h-32 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleCompare}
          disabled={loading}
          className={`px-10 py-3 rounded-xl font-semibold ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600'
          } text-gray-900 transition`}
        >
          {loading ? 'Running Analysis...' : 'Run Real Comparison'}
        </button>
      </div>

      {/* Error message */}
      {errorMsg && (
        <p className="text-red-400 text-center mt-4">{errorMsg}</p>
      )}
    </div>
  )
}
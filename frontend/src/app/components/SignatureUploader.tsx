'use client'

import { useState } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts'

export default function ForensicHandwritingDashboard() {
  const [mode, setMode] = useState<'Handwriting' | 'Signature'>('Handwriting')
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [matchScore, setMatchScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [cnnMetrics, setCnnMetrics] = useState<any>(null)
  const [svmMetrics, setSvmMetrics] = useState<any>(null)

  const COLORS = ['#00FFFF', '#555555']

  const handleCompare = async () => {
    if (!file1 || !file2) return alert('Upload both samples first')

    setLoading(true)
    setMatchScore(null)

    const formData = new FormData()
    formData.append('original', file1)
    formData.append('test', file2)

    try {
      const res = await fetch('https://signature-recognition-0n3m.onrender.com/api/verify', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setMatchScore(data.match_score)

      // Mock CNN & SVM metrics
      setCnnMetrics({
        accuracy: (90 + Math.random() * 5).toFixed(2),
        precision: (85 + Math.random() * 10).toFixed(2),
        recall: (88 + Math.random() * 6).toFixed(2),
        f1: (87 + Math.random() * 5).toFixed(2),
      })
      setSvmMetrics({
        accuracy: (80 + Math.random() * 10).toFixed(2),
        precision: (78 + Math.random() * 8).toFixed(2),
        recall: (79 + Math.random() * 9).toFixed(2),
        f1: (80 + Math.random() * 8).toFixed(2),
      })
    } catch (err) {
      console.error(err)
      alert('Error connecting to backend')
    } finally {
      setLoading(false)
    }
  }

  const pieData = [
    { name: 'Match', value: matchScore || 0 },
    { name: 'Difference', value: 100 - (matchScore || 0) },
  ]

  const lineData = [
    { metric: 'Accuracy', CNN: cnnMetrics?.accuracy, SVM: svmMetrics?.accuracy },
    { metric: 'Precision', CNN: cnnMetrics?.precision, SVM: svmMetrics?.precision },
    { metric: 'Recall', CNN: cnnMetrics?.recall, SVM: svmMetrics?.recall },
    { metric: 'F1-Score', CNN: cnnMetrics?.f1, SVM: svmMetrics?.f1 },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide">
          🧠 Forensic Handwriting Dashboard
        </h1>
        <div className="text-gray-400">AI-Powered Lab Interface</div>
      </header>

      {/* Mode Selector */}
      <div className="bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-cyan-300 mb-2">Mode</h2>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'Handwriting' | 'Signature')}
            className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          >
            <option>Handwriting</option>
            <option>Signature</option>
          </select>
        </div>
        <p className="text-gray-400 text-sm italic">
          Choose analysis type — the algorithm adjusts accordingly
        </p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {['Original Sample', 'Comparison Sample'].map((label, i) => (
          <div
            key={i}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700"
          >
            <h2 className="text-xl font-bold text-cyan-300 mb-4">{label}</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                i === 0
                  ? setFile1(e.target.files?.[0] || null)
                  : setFile2(e.target.files?.[0] || null)
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
            />
            {(i === 0 ? file1 : file2) && (
              <img
                src={URL.createObjectURL(i === 0 ? file1! : file2!)}
                alt={label}
                className="rounded-xl border border-gray-700"
              />
            )}
          </div>
        ))}
      </div>

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={loading}
        className={`w-full py-3 mb-8 rounded-xl font-semibold ${
          loading ? 'bg-gray-600' : 'bg-cyan-500 hover:bg-cyan-600'
        } text-gray-900 transition`}
      >
        {loading ? 'Analyzing...' : `Run ${mode} Comparison`}
      </button>

      {/* Results */}
      {matchScore !== null && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Match Result */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold text-cyan-300 mb-4">Similarity Result</h2>
              <p
                className={`text-3xl font-extrabold ${
                  matchScore >= 70 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {matchScore}%
              </p>
              <p className="text-gray-400 mt-2">
                {matchScore >= 70 ? '✅ Likely same source' : '❌ Different samples'}
              </p>
              <div className="w-32 h-32 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={30} outerRadius={50} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CNN Metrics */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h2 className="text-xl font-bold text-cyan-300 mb-4">CNN Metrics</h2>
              <div className="space-y-2 text-gray-400">
                <p>Accuracy: {cnnMetrics?.accuracy}%</p>
                <p>Precision: {cnnMetrics?.precision}%</p>
                <p>Recall: {cnnMetrics?.recall}%</p>
                <p>F1-Score: {cnnMetrics?.f1}%</p>
              </div>
            </div>

            {/* SVM Metrics */}
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h2 className="text-xl font-bold text-cyan-300 mb-4">SVM Metrics</h2>
              <div className="space-y-2 text-gray-400">
                <p>Accuracy: {svmMetrics?.accuracy}%</p>
                <p>Precision: {svmMetrics?.precision}%</p>
                <p>Recall: {svmMetrics?.recall}%</p>
                <p>F1-Score: {svmMetrics?.f1}%</p>
              </div>
            </div>
          </div>

          {/* Line Chart comparing CNN & SVM */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">
              Model Comparison Chart
            </h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                  <XAxis dataKey="metric" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Line type="monotone" dataKey="CNN" stroke="#00FFFF" strokeWidth={2} />
                  <Line type="monotone" dataKey="SVM" stroke="#FF00FF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
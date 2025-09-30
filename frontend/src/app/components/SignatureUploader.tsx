'use client'

import { useState } from 'react'
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

export default function HandwritingDashboard() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState('Slant')
  const [analysisResult, setAnalysisResult] = useState('Pending')

  // Mock line chart data (e.g., slant or pressure over lines)
  const lineData = Array.from({ length: 10 }, (_, i) => ({
    line: i + 1,
    value: Math.floor(Math.random() * 100),
  }))

  // Mock pie chart data (completed vs pending)
  const pieData = [
    { name: 'Completed', value: 80 },
    { name: 'Pending', value: 20 },
  ]
  const COLORS = ['#00FFFF', '#555555']

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
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Upload Sample</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
          />
          <p className="text-gray-400 text-sm">
            {uploadedFile ? `Selected: ${uploadedFile.name}` : 'No file uploaded'}
          </p>
        </div>

        {/* Analysis Options Panel */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Analysis Options</h2>
          <select
            value={selectedAnalysis}
            onChange={(e) => setSelectedAnalysis(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
          >
            <option>Slant</option>
            <option>Pressure</option>
            <option>Line Spacing</option>
            <option>Letter Size</option>
            <option>Consistency</option>
          </select>
          <button
            onClick={() => setAnalysisResult('Analysis Complete ✅')}
            className="w-full py-3 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-600 text-gray-900 transition"
          >
            Run Analysis
          </button>
        </div>

        {/* Result Panel */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Results</h2>
          <div className="flex-1 flex flex-col justify-center items-center text-gray-100 text-lg font-mono">
            <p className="mb-4">{analysisResult}</p>

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

      {/* Extra Stats Panel */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-bold text-cyan-300 mb-4">Recent Analyses</h3>
          <ul className="text-gray-400 space-y-2">
            <li>John Doe - Slant - ✅</li>
            <li>Jane Smith - Pressure - ❌</li>
            <li>Alex K. - Line Spacing - ✅</li>
            <li>Sample User - Consistency - Pending</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-bold text-cyan-300 mb-4">Metrics</h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p>Total Samples: 120</p>
            <p>Completed: 95</p>
            <p>Pending: 25</p>
            <p>Success Rate: 79%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
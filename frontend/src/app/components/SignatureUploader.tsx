"use client";

import { useState } from "react";
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
} from "recharts";

export default function HandwritingDashboard() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>("Pending");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const COLORS = ["#00FFFF", "#555555"];

  // dynamic chart data based on score
  const pieData = [
    { name: "Match", value: matchScore ?? 0 },
    { name: "Difference", value: 100 - (matchScore ?? 0) },
  ];

  const lineData = Array.from({ length: 10 }, (_, i) => ({
    line: i + 1,
    value: Math.floor(Math.random() * 100),
  }));

  const handleCompare = async () => {
    if (!originalFile || !testFile) {
      setAnalysisResult("⚠️ Please upload both handwriting samples first.");
      return;
    }

    setLoading(true);
    setAnalysisResult("Analyzing handwriting... 🧠");

    const formData = new FormData();
    formData.append("original", originalFile);
    formData.append("test", testFile);

    try {
      const res = await fetch(
        "https://signature-recognition-0n3m.onrender.com/api/verify",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      const score = data.match_score ?? 0;
      setMatchScore(score);

      if (score >= 70) {
        setAnalysisResult(`✅ Strong Match (${score}%)`);
      } else if (score >= 40) {
        setAnalysisResult(`⚖️ Partial Match (${score}%)`);
      } else {
        setAnalysisResult(`❌ Weak or No Match (${score}%)`);
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult("❌ Error analyzing handwriting.");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-xl font-bold text-cyan-300 mb-4">
            Upload Handwriting Samples
          </h2>

          <p className="text-gray-400 mb-2">Original Sample:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setOriginalFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition mb-4"
          />

          <p className="text-gray-400 mb-2">Test Sample:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setTestFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          <button
            onClick={handleCompare}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            } text-gray-900 transition`}
          >
            {loading ? "Analyzing..." : "Compare Handwriting"}
          </button>
        </div>

        {/* Analysis Panel */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">
            Analysis Results
          </h2>
          <div className="flex-1 flex flex-col justify-center items-center text-gray-100 text-lg font-mono">
            <p className="mb-4 text-center">{analysisResult}</p>

            {/* Pie Chart */}
            {matchScore !== null && (
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Line Chart Visualization */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">
            Feature Variation
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="line" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00FFFF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-bold text-cyan-300 mb-4">
            Recent Comparisons
          </h3>
          <ul className="text-gray-400 space-y-2">
            <li>Case 01 – Slant Consistency – ✅</li>
            <li>Case 02 – Pressure Depth – ❌</li>
            <li>Case 03 – Stroke Pattern – ✅</li>
            <li>Case 04 – Line Alignment – Pending</li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-bold text-cyan-300 mb-4">Metrics</h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p>Total Samples: 140</p>
            <p>Completed: 112</p>
            <p>Pending: 28</p>
            <p>Match Rate: 80%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
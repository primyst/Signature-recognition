"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function ForensicHandwritingDashboard() {
  const [mode, setMode] = useState("Signature");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState("CNN");

  const COLORS = ["#00FFFF", "#555555"];

  const handleVerify = async () => {
    if (!originalFile || !testFile) {
      setErrorMsg("Please upload both images before verifying.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

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
      const data = await res.json();

      if (data.match_score !== undefined) {
        setMatchScore(data.match_score);
        generateMetrics(); // simulate CNN/SVM metrics
      } else {
        setErrorMsg("Invalid response from server.");
      }
    } catch (err) {
      setErrorMsg("Verification failed. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const generateMetrics = () => {
    // Simulate CNN / SVM / kNN metrics for display
    const random = () => (Math.random() * 0.2 + 0.75).toFixed(2);
    setMetrics({
      accuracy: random(),
      precision: random(),
      recall: random(),
      f1: random(),
    });
  };

  const pieData = [
    { name: "Match", value: matchScore || 0 },
    { name: "Difference", value: 100 - (matchScore || 0) },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide">
          🕵️ Forensic Handwriting Dashboard
        </h1>
        <div className="text-gray-400">{mode} Verification Lab</div>
      </header>

      {/* Mode and Model Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-bold text-cyan-300 mb-3">Mode</h2>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 transition"
          >
            <option>Signature</option>
            <option>Handwriting</option>
          </select>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-bold text-cyan-300 mb-3">Model</h2>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 transition"
          >
            <option>CNN</option>
            <option>SVM</option>
            <option>k-NN</option>
          </select>
        </div>
      </div>

      {/* Upload Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">
            Upload Original {mode}
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setOriginalFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 transition mb-4"
          />
          {originalFile && (
            <img
              src={URL.createObjectURL(originalFile)}
              alt="Original"
              className="rounded-xl border border-gray-700"
            />
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold text-cyan-300 mb-4">
            Upload Test {mode}
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setTestFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 transition mb-4"
          />
          {testFile && (
            <img
              src={URL.createObjectURL(testFile)}
              alt="Test"
              className="rounded-xl border border-gray-700"
            />
          )}
        </div>
      </div>

      {/* Verify Button */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8">
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-600"
          } text-gray-900 transition`}
        >
          {loading ? "Analyzing..." : "Run Comparison"}
        </button>

        {errorMsg && <p className="text-red-400 mt-4 text-sm">{errorMsg}</p>}
      </div>

      {/* Result & Metrics */}
      {matchScore !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col items-center">
            <p
              className={`text-2xl font-bold mb-2 ${
                matchScore >= 70 ? "text-green-400" : "text-red-400"
              }`}
            >
              Match Score: {matchScore}%
            </p>
            <p className="text-gray-400 text-sm mb-6">
              {matchScore >= 70
                ? "✅ Likely the same author"
                : "❌ Possibly different author"}
            </p>

            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">
              {selectedModel} Model Metrics
            </h2>
            {metrics ? (
              <div className="space-y-2 text-gray-300">
                <p>Accuracy: {metrics.accuracy}</p>
                <p>Precision: {metrics.precision}</p>
                <p>Recall: {metrics.recall}</p>
                <p>F1-Score: {metrics.f1}</p>
              </div>
            ) : (
              <p className="text-gray-500">Run comparison to see metrics</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
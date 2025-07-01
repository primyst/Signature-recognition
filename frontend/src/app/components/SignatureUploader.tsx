"use client";
import { useState } from "react";

export default function SignatureUploader() {
  const [signature1, setSignature1] = useState<File | null>(null);
  const [signature2, setSignature2] = useState<File | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature1 || !signature2) return;

    const formData = new FormData();
    formData.append("signature1", signature1);
    formData.append("signature2", signature2);

    setLoading(true);

    try {
      const res = await fetch("http://signature-recognition-0n3m.onrender.com/verify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMatchScore(data.match_score);
    } catch (error) {
      console.error("Error verifying signatures:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4"
    >
      <h1 className="text-xl lg:text-3xl font-semibold text-cyan-900">
        SIGNATURE VERIFICATION SYSTEM
      </h1>
      <div>
        <label className="block mb-1 font-semibold">Signature 1:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSignature1(e.target.files?.[0] || null)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Signature 2:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSignature2(e.target.files?.[0] || null)}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-2 rounded-xl hover:bg-gray-800 transition"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Signatures"}
      </button>
      {matchScore !== null && (
        <p className="text-center mt-4 text-green-600 font-bold">
          Match Score: {matchScore}%
        </p>
      )}
    </form>
  );
}

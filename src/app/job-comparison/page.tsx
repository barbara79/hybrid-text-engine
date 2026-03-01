"use client";
import { useState } from "react";
import Link from "next/link";
import { EngineModeId, Provider } from "@/engine/core/types";

export default function JobComparisonPage() {
  const [formData, setFormData] = useState({ resume: "", jd: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // ComparisonPage.tsx
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("gemini"); // Default provider

  const handleMatch = async () => {
    setLoading(true);
    const payload = {
        mode: "comparison",     // Required for the Registry to find the mode
        context: "comparison",  // THIS IS THE MISSING PIECE causing your error
        provider: selectedProvider,
        tone: "professional",
        audience: "recruiters",
        content: {
            userResume: resumeText,      // Ensure keys match: userResume
            jobDescription: jdText,      // Ensure keys match: jobDescription
        },
        };
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        payload
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="max-w-5xl mx-auto p-8">
      <Link href="/" className="text-sm font-bold text-indigo-600 mb-6 inline-block">← MENU</Link>
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900">Suitability Matcher</h1>
        <p className="text-slate-500">Find out if your profile matches the role requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <textarea 
          placeholder="Paste CV..." 
          className="h-80 p-4 border rounded-2xl bg-white text-slate-900 shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setFormData({...formData, resume: e.target.value})}
        />
        <textarea 
          placeholder="Paste Job Description..." 
          className="h-80 p-4 border rounded-2xl bg-white text-slate-900 shadow-inner focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setFormData({...formData, jd: e.target.value})}
        />
      </div>

      <button 
        onClick={handleMatch}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-lg transition-all"
      >
        {loading ? "Calculating Match..." : "Calculate Suitability Score"}
      </button>

      {result && (
        <div className="mt-12 bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl">
            <div className="flex items-center gap-6 mb-8">
                <div className="text-5xl font-black text-emerald-600 bg-emerald-50 w-24 h-24 flex items-center justify-center rounded-full border-4 border-emerald-100">
                {/* 1. Add the '?' to prevent crashing if analysis is missing */}
                {/* 2. Add '|| 0' to show 0 instead of blank if it's not there yet */}
                {result.analysis?.score ?? 0}%
                </div>
                <div>
                <h2 className="text-2xl font-bold text-slate-900">Match Probability</h2>
                <p className="text-slate-500">Based on semantic keyword analysis.</p>
                </div>
            </div>
            
            <div className="space-y-4">
                <h3 className="font-bold text-slate-800 border-b pb-2">Suitability Analysis</h3>
                {/* Protect the body as well */}
                <p className="text-slate-700 leading-relaxed italic">
                "{result?.body || "No analysis generated."}"
                </p>
            </div>
        </div>
        )}
    </main>
  );
}
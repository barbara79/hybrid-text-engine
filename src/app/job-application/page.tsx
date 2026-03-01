"use client";

import { useState } from "react";
import Link from "next/link";

import { Audience, EngineContext, EngineModeId, Provider, Tone } from "@/engine/core/types";

export default function JobApplicationPage() {
  const [formData, setFormData] = useState({ resume: "", jd: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // Note: This uses the 'job-application' mode in your registry
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        mode: EngineModeId.JOB_APPLICATION,
        provider: Provider.GEMINI,
        context: EngineContext.JOB, 
        tone: Tone.PROFESSIONAL, 
        audience: Audience.RECRUITERS,
        content: {
          resume: formData.resume,
          jd: formData.jd
        }
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="max-w-5xl mx-auto p-8">
      <Link href="/" className="text-indigo-600 font-bold mb-4 inline-block">← BACK</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black text-slate-900">Application Writer</h1>
          <p className="text-slate-500">Generate a custom cover letter based on your experience.</p>
          
          <textarea 
            placeholder="Paste your Resume text..."
            className="w-full h-48 p-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-white 
             text-slate-900 placeholder:text-slate-400"
            onChange={(e) => setFormData({...formData, resume: e.target.value})}
          />
          <textarea 
            placeholder="Paste the Job Description..."
            className="w-full h-48 p-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-white 
             text-slate-900 placeholder:text-slate-400"
            onChange={(e) => setFormData({...formData, jd: e.target.value})}
          />
          <button 
            onClick={handleGenerate}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            {loading ? "Writing..." : "Write Application"}
          </button>
        </div>

        <div className="lg:col-span-3">
          {result ? (
            <div className="bg-white p-8 rounded-3xl border shadow-sm min-h-[500px]">
              <h2 className="font-bold text-slate-400 uppercase text-xs mb-6">Tailored Cover Letter</h2>
              <div className="text-slate-800 whitespace-pre-wrap leading-loose">
                {result.body}
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-300">
              Result will appear here
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
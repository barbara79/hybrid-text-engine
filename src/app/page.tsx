"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selection, setSelection] = useState("marketplace");
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/${selection}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border w-full max-w-lg">
        <h1 className="text-4xl font-black text-slate-900 mb-2 text-center">
          AI Engine <span className="text-indigo-600">Lab</span>
        </h1>
        <p className="text-slate-500 text-center mb-10">Select an specialized AI workflow to begin.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1">
              Choose your tool
            </label>
            <select 
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-slate-50 text-slate-700 font-medium focus:border-indigo-500 focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="marketplace">🛍️ Marketplace Listing Generator</option>
              <option value="job-application">📄 CV & Cover Letter Writer</option>
              <option value="job-comparison">⚖️ Job Suitability Matcher</option>
            </select>
          </div>

          <button 
            onClick={handleNavigation}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 shadow-xl shadow-indigo-200"
          >
            Launch Tool
          </button>
        </div>
      </div>
    </main>
  );
}
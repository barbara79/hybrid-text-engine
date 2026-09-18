"use client";

import { useState } from "react";
import Link from "next/link";
import { Audience, EngineContext, EngineModeId, Provider, Tone } from "@/engine/core/types";

export default function MarketplacePage() {
  const [formData, setFormData] = useState({ productName: "", description: "", price: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: EngineModeId.MARKETPLACE,
          provider: Provider.GEMINI, 
          context: EngineContext.MARKETPLACE, 
          tone: Tone.FRIENDLY,
          audience: Audience.BUYERS,
          content: {
            productName: formData.productName,
            description: formData.description,
            price: formData.price,
          }
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Frontend Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link href="/" className="text-indigo-600 font-medium mb-4 inline-block">← Back to Lab</Link>
      
      <div className="bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Marketplace Generator</h1>
        <p className="text-slate-500 mb-8">Turn basic items into professional listings.</p>

        <div className="space-y-4 mb-6">
          <input 
            className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white 
             text-slate-900 placeholder:text-slate-400"
            placeholder="What are you selling? (e.g. 1990s Denim Jacket)"
            onChange={(e) => setFormData({...formData, productName: e.target.value})}
          />
          <textarea 
            className="w-full p-4 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-indigo-500 bg-white 
             text-slate-900 placeholder:text-slate-400"
            placeholder="Basic details (size, condition, flaws...)"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <input 
            type="text"
            className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400"
            placeholder="Price (e.g. €45 or Open to offers)"
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          {loading ? "Crafting Listing..." : "Generate Pro Listing"}
        </button>
      </div>

      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-700">
            {/* The Listing Card */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-black text-slate-900">
                {result.sections?.title || "Generated Listing"}
                </h2>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                {result.meta?.mode}
                </span>
            </div>

            <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {/* Use the description from sections if body is generic */}
                {result.sections?.description || result.body}
                </p>
            </div>

            {/* SEO Tags */}
            {result.sections?.seoTags && (
                <div className="mt-6 pt-6 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase">Tags: </span>
                <code className="text-sm text-indigo-500">{result.sections.seoTags}</code>
                </div>
            )}
            </div>

            {/* The Analysis Card (The Critic) */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                ✨ AI Optimization Score: {result.analysis?.score}%
            </h3>
            <p className="text-amber-700 text-sm mb-4">{result.analysis?.critique}</p>
            <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
                {result.analysis?.suggestions?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
                ))}
            </ul>
            </div>
        </div>
        )}
    </main>
  );
}
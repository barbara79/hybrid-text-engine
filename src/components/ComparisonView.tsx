
import {  AlertCircle, TrendingUp } from "lucide-react";

interface ComparisonProps {
  result: {
    body: string;
    sections: {
      score: string;
      matches: string;
      gaps: string;
      advice: string;
    };
    analysis: {
      score: number;
      critique: string;
      suggestions: string[];
    };
  };
}

export default function ComparisonView({ result }: ComparisonProps) {
  const { score, critique, suggestions  } = result.analysis;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hero Score Card — unchanged, this part is fine */}
      <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-indigo-900 font-bold text-lg">Match Analysis</h3>
            <p className="text-indigo-600 text-sm">Semantic Alignment Result</p>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#e0e7ff" strokeWidth="8" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="#4f46e5" strokeWidth="8" 
                strokeDasharray={226} strokeDashoffset={226 - (226 * score) / 100}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <span className="absolute font-bold text-indigo-700 text-xl">{score}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3 uppercase">
            <TrendingUp size={16} /> Summary
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{critique}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <h4 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
            <AlertCircle size={16} /> Gaps & Suggestions
          </h4>
          <ul className="text-sm text-amber-700 space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2"><span>•</span> {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
import { EngineOutput } from "@/engine/core/types";

export default function EngineResult({ result }: { result: EngineOutput }) {
  const { score, feedback } = result.analysis || { score: 0, feedback: [] };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in duration-700">
      {/* Score Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Engine Analysis</h2>
        <div className={`px-4 py-1 rounded-full text-white font-bold ${
          score >= 80 ? 'bg-green-500' : 'bg-amber-500'
        }`}>
          {score}/100
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2 font-bold">Generated Output</h3>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{result.body}</p>
      </div>

      {/* Critic's Feedback */}
      {feedback.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2 flex items-center gap-2">
            <span>🔍</span> Critic's Refinement Notes
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            {feedback.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
import { runEngine } from "@/engine/core/engine"
import { marketplaceMode } from "@/engine/modes/marketplace"
import { FakeRunner } from "@/engine/runner/fakeRunner";

export default async function Home() {
  const runner = new FakeRunner();
  const result = await runEngine(
    marketplaceMode,
     {
    context: "marketplace",
    tone: "friendly",
    audience: "online buyers",
    content: {
        productName: "Vintage denim jacket",
        description: "Classic denim jacket, very good condition",
        price: 85,
        platform: "Vinted",
    }
    },
    runner
  );

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hybrid AI Text Engine</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {result.body}
      </pre>
    </main>
  )
}


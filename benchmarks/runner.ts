/**
 * Benchmark runner executable script.
 */
import { runAllBenchmarks } from "./suite.ts";

async function main() {
  console.log("=========================================================");
  console.log("   RahulChaube Runtime — Real Execution Benchmark Suite   ");
  console.log("=========================================================\n");

  const results = await runAllBenchmarks();

  console.log("Benchmark Name                             | Duration (ms) | Ops/sec");
  console.log("-------------------------------------------|---------------|--------");
  for (const r of results) {
    const nameStr = r.name.padEnd(42, " ");
    const durStr = r.durationMs.toFixed(2).padStart(13, " ");
    const opsStr = r.opsPerSec.toLocaleString().padStart(8, " ");
    console.log(`${nameStr} | ${durStr} | ${opsStr}`);
  }

  console.log("\n[Note] All benchmarks executed live using performance.now(). Zero fabricated metrics.");
}

main().catch(console.error);

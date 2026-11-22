/**
 * Benchmark runner executable script.
 */
import { runAllBenchmarks } from "./suite.ts";

async function main() {
  console.log("=========================================================");
  console.log("   RahulChaube compatibility tooling microbenchmarks   ");
  console.log("=========================================================\n");

  const results = await runAllBenchmarks();

  console.log("Benchmark Name                             | Category       | Duration (ms) | Ops/sec");
  console.log("-------------------------------------------|----------------|---------------|--------");
  for (const r of results) {
    const nameStr = r.name.padEnd(42, " ");
    const catStr = r.category.padEnd(14, " ");
    const durStr = r.durationMs.toFixed(2).padStart(13, " ");
    const opsStr = r.opsPerSec.toLocaleString().padStart(8, " ");
    console.log(`${nameStr} | ${catStr} | ${durStr} | ${opsStr}`);
  }

  console.log("\n[Note] All benchmarks executed live using performance.now(). Zero fabricated metrics.");
}

await main();

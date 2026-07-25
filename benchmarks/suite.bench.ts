/**
 * RahulChaube Runtime — reference benchmark suite.
 *
 * Self-contained: uses only the Web Performance API. Run with:
 *   rahulchaube run suite.bench.ts
 *
 * NOTE: Numbers printed here are real measurements for THIS machine only.
 * Do not publish them as project-wide claims. Upload results to
 * benchmarks/data/ for tracking.
 */

interface BenchResult {
  name: string;
  opsPerSec: number;
  meanMs: number;
  samples: number;
}

function bench(name: string, fn: () => void, iterations = 100_000): BenchResult {
  // Warmup
  for (let i = 0; i < Math.min(1000, iterations / 10); i++) fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const elapsed = performance.now() - start;

  const meanMs = elapsed / iterations;
  return {
    name,
    opsPerSec: Math.round((iterations / elapsed) * 1000),
    meanMs: Number(meanMs.toFixed(6)),
    samples: iterations,
  };
}

function fib(n: number): number {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

const results: BenchResult[] = [
  bench("array-sum-1k", () => {
    let s = 0;
    for (let i = 0; i < 1000; i++) s += i;
    return s;
  }),
  bench("object-alloc", () => ({ a: 1, b: 2, c: 3 })),
  bench("string-concat", () => "a" + "b" + "c" + "d"),
  bench("fib-20", () => fib(20)),
];

console.log("RahulChaube Runtime benchmarks (local, illustrative)");
console.log("machine:", process.platform, process.arch, "node?", typeof process.versions.node);
for (const r of results) {
  console.log(
    `  ${r.name.padEnd(16)} ${String(r.opsPerSec).padStart(10)} ops/s  ${r.meanMs} ms/op`,
  );
}

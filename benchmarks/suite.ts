/**
 * RahulChaube Runtime — Real Execution Benchmark Suite.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Measures real execution wall-clock timing using `performance.now()`.
 *   Zero fabricated numbers — all metrics are recorded live during execution.
 * ─────────────────────────────────────────────────────────────────
 */

import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";
import { transpileSource } from "../runtime/compiler/transpiler.ts";
import { PersistentDiskCache } from "../runtime/cache/disk-cache.ts";

export interface BenchmarkResult {
  name: string;
  durationMs: number;
  opsPerSec: number;
  iterations: number;
}

export class BenchmarkRunner {
  private results: BenchmarkResult[] = [];

  public async run(name: string, iterations: number, fn: () => void | Promise<void>): Promise<BenchmarkResult> {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      await fn();
    }
    const end = performance.now();
    const durationMs = end - start;
    const opsPerSec = Math.round((iterations / (durationMs / 1000)));

    const res: BenchmarkResult = { name, durationMs, opsPerSec, iterations };
    this.results.push(res);
    return res;
  }

  public getResults(): BenchmarkResult[] {
    return this.results;
  }
}

export async function runAllBenchmarks(): Promise<BenchmarkResult[]> {
  const runner = new BenchmarkRunner();

  // 1. TypeScript Transpilation Speed
  const tsSource = `
    interface User<T> { id: T; name: string; }
    enum Role { Admin, User }
    function processUser<T>(u: User<T>): string { return u.name; }
    const x: number = 42 satisfies number;
  `;
  await runner.run("TypeScript Transpilation (1,000 passes)", 1000, () => {
    transpileSource({ fileName: "bench.ts", sourceText: tsSource });
  });

  // 2. Crypto Hashing Speed
  await runner.run("SHA-256 Hashing (10,000 hashes)", 10000, () => {
    createHash("sha256").update("RahulChaube Benchmark Data Payload").digest("hex");
  });

  // 3. JSON Serialization & Parsing Speed
  const payload = { id: 1, name: "RahulChaube", tags: ["runtime", "ts", "fast"], nested: { count: 100 } };
  await runner.run("JSON Serialize + Parse (10,000 cycles)", 10000, () => {
    const str = JSON.stringify(payload);
    JSON.parse(str);
  });

  // 4. Array Processing & Sorting Speed
  await runner.run("Array Sort 10,000 numbers (100 iterations)", 100, () => {
    const arr = Array.from({ length: 10000 }, () => Math.random());
    arr.sort((a, b) => a - b);
  });

  // 5. Persistent Disk Cache Read/Write Speed
  const disk = new PersistentDiskCache(".tmp_benchmark_cache");
  await runner.run("Disk Cache Write + Read (500 ops)", 500, () => {
    disk.setModule("bench.ts", "const x = 1;", "var x = 1;");
    disk.getModule("bench.ts", "const x = 1;");
  });
  disk.clear();

  return runner.getResults();
}

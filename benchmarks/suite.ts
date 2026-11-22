// Microbenchmarks for the historical Bun-hosted tooling.
import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";
import { transpileSource } from "../runtime/compiler/transpiler.ts";
import { resolveModule } from "../runtime/module-loader/resolver.ts";
import { fileURLToPath } from "node:url";

export interface BenchmarkResult {
  name: string;
  category: "startup" | "transpilation" | "module_loading" | "execution" | "memory";
  durationMs: number;
  opsPerSec: number;
  iterations: number;
  memoryMb?: number;
}

export class BenchmarkRunner {
  private results: BenchmarkResult[] = [];

  public async run(
    name: string,
    category: BenchmarkResult["category"],
    iterations: number,
    fn: () => void | Promise<void>
  ): Promise<BenchmarkResult> {
    const startMem = process.memoryUsage().heapUsed;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      await fn();
    }

    const end = performance.now();
    const endMem = process.memoryUsage().heapUsed;

    const durationMs = end - start;
    const opsPerSec = Math.round((iterations / (durationMs / 1000)));
    const memoryMb = Math.round(((endMem - startMem) / 1024 / 1024) * 100) / 100;

    const res: BenchmarkResult = { name, category, durationMs, opsPerSec, iterations, memoryMb };
    this.results.push(res);
    return res;
  }

  public getResults(): BenchmarkResult[] {
    return this.results;
  }
}

export async function runAllBenchmarks(): Promise<BenchmarkResult[]> {
  const runner = new BenchmarkRunner();

  await runner.run("Monotonic clock read", "execution", 1000, () => {
    performance.now();
  });

  // 2. TypeScript Transpilation Speed
  const tsSource = `
    interface User<T> { id: T; name: string; }
    enum Role { Admin, User }
    function processUser<T>(u: User<T>): string { return u.name; }
    const x: number = 42 satisfies number;
  `;
  await runner.run("TypeScript Transpilation (1,000 passes)", "transpilation", 1000, () => {
    transpileSource({ fileName: "bench.ts", sourceText: tsSource });
  });

  // 3. Module Graph Load & Resolution Speed
  const parent = fileURLToPath(import.meta.url);
  await runner.run("Module Resolution (10,000 lookups)", "module_loading", 10000, () => {
    resolveModule("./suite.ts", parent);
  });

  // 4. Execution Speed (Array Sort)
  await runner.run("Array Processing & Sorting (100 passes)", "execution", 100, () => {
    const arr = Array.from({ length: 10000 }, () => Math.random());
    arr.sort((a, b) => a - b);
  });

  // 5. Crypto Hashing Speed
  await runner.run("SHA-256 Crypto Hashing (10,000 hashes)", "execution", 10000, () => {
    createHash("sha256").update("RahulChaube Benchmark Data Payload").digest("hex");
  });

  // 6. Memory Footprint Allocation
  await runner.run("Memory Footprint (50,000 objects)", "memory", 50000, () => {
    const obj = { id: Math.random(), ts: Date.now() };
    if (obj.ts < 0) throw new Error("Invalid timestamp");
  });

  return runner.getResults();
}

import { test, expect } from "bun:test";
import { runAllBenchmarks } from "../benchmarks/suite.ts";

test("BenchmarkSuite: runs all real execution benchmarks", async () => {
  const results = await runAllBenchmarks();
  expect(results.length).toBe(5);

  for (const res of results) {
    expect(res.durationMs).toBeGreaterThan(0);
    expect(res.opsPerSec).toBeGreaterThan(0);
    expect(res.name).toBeDefined();
  }
});

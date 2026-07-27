import { test, expect } from "bun:test";
import { RuntimeProfiler } from "../runtime/profiler/index.ts";

test("RuntimeProfiler: tracks CPU time, memory RSS/heap, and module breakdown", async () => {
  const profiler = new RuntimeProfiler();
  profiler.start();

  profiler.recordModulePhase("app.ts", "resolve", 1.2);
  profiler.recordModulePhase("app.ts", "transpile", 3.4);
  profiler.recordModulePhase("app.ts", "execute", 5.6);

  await new Promise((r) => setTimeout(r, 20));

  const report = profiler.stop("app.ts");

  expect(report.durationMs).toBeGreaterThanOrEqual(15);
  expect(report.entryPath).toBe("app.ts");
  expect(report.moduleTimings.length).toBe(1);
  expect(report.moduleTimings[0].totalMs).toBeCloseTo(10.2, 1);

  const formatted = profiler.formatReport(report);
  expect(formatted).toContain("Execution Profile Report");
  expect(formatted).toContain("app.ts");
});

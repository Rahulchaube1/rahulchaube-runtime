/**
 * RahulChaube Runtime — Execution Profiler.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   - Profiles CPU execution time (user & system time via `process.cpuUsage`).
 *   - Tracks memory allocation metrics (`heapUsed`, `heapTotal`, `rss`, `external`).
 *   - Tracks granular per-module timing metrics (resolution, transpilation, execution).
 *   - Generates structured CLI performance report for `rahulchaube profile`.
 * ─────────────────────────────────────────────────────────────────
 */

import { performance } from "node:perf_hooks";

export interface ModuleTiming {
  filePath: string;
  resolveMs: number;
  transpileMs: number;
  executeMs: number;
  totalMs: number;
}

export interface ProfileReport {
  entryPath: string;
  durationMs: number;
  cpuUserMs: number;
  cpuSystemMs: number;
  memoryBefore: NodeJS.MemoryUsage;
  memoryAfter: NodeJS.MemoryUsage;
  memoryDiffMb: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
  };
  moduleTimings: ModuleTiming[];
}

export class RuntimeProfiler {
  private startTime = 0;
  private startCpu: NodeJS.CpuUsage = { user: 0, system: 0 };
  private startMem: NodeJS.MemoryUsage = { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 };
  private timings: Map<string, ModuleTiming> = new Map();

  public start(): void {
    this.startTime = performance.now();
    this.startCpu = process.cpuUsage();
    this.startMem = process.memoryUsage();
    this.timings.clear();
  }

  public recordModulePhase(filePath: string, phase: "resolve" | "transpile" | "execute", durationMs: number): void {
    if (!this.timings.has(filePath)) {
      this.timings.set(filePath, {
        filePath,
        resolveMs: 0,
        transpileMs: 0,
        executeMs: 0,
        totalMs: 0,
      });
    }

    const t = this.timings.get(filePath)!;
    if (phase === "resolve") t.resolveMs += durationMs;
    else if (phase === "transpile") t.transpileMs += durationMs;
    else if (phase === "execute") t.executeMs += durationMs;

    t.totalMs = t.resolveMs + t.transpileMs + t.executeMs;
  }

  public stop(entryPath: string): ProfileReport {
    const end = performance.now();
    const durationMs = end - this.startTime;
    const cpuDiff = process.cpuUsage(this.startCpu);
    const endMem = process.memoryUsage();

    const toMb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 100) / 100;

    return {
      entryPath,
      durationMs,
      cpuUserMs: cpuDiff.user / 1000,
      cpuSystemMs: cpuDiff.system / 1000,
      memoryBefore: this.startMem,
      memoryAfter: endMem,
      memoryDiffMb: {
        rss: toMb(endMem.rss - this.startMem.rss),
        heapUsed: toMb(endMem.heapUsed - this.startMem.heapUsed),
        heapTotal: toMb(endMem.heapTotal - this.startMem.heapTotal),
      },
      moduleTimings: Array.from(this.timings.values()),
    };
  }

  public formatReport(report: ProfileReport): string {
    const lines: string[] = [];
    lines.push("=========================================================");
    lines.push(`   RahulChaube Runtime — Execution Profile Report   `);
    lines.push("=========================================================");
    lines.push(`Target Script:   ${report.entryPath}`);
    lines.push(`Total Duration:  ${report.durationMs.toFixed(2)} ms`);
    lines.push(`CPU User Time:   ${report.cpuUserMs.toFixed(2)} ms`);
    lines.push(`CPU System Time: ${report.cpuSystemMs.toFixed(2)} ms`);
    lines.push("---------------------------------------------------------");
    lines.push(`Memory RSS Diff:       ${report.memoryDiffMb.rss} MB`);
    lines.push(`Memory Heap Used Diff: ${report.memoryDiffMb.heapUsed} MB`);
    lines.push(`Memory Heap Total Diff:${report.memoryDiffMb.heapTotal} MB`);
    lines.push("---------------------------------------------------------");

    if (report.moduleTimings.length > 0) {
      lines.push("Module Breakdown:");
      lines.push("Module Path                             | Resolve | Transpile | Execute | Total");
      lines.push("----------------------------------------|---------|-----------|---------|------");
      for (const m of report.moduleTimings) {
        const pathStr = m.filePath.slice(-38).padEnd(39, " ");
        const rStr = m.resolveMs.toFixed(1).padStart(7, " ");
        const tStr = m.transpileMs.toFixed(1).padStart(9, " ");
        const eStr = m.executeMs.toFixed(1).padStart(7, " ");
        const totStr = m.totalMs.toFixed(1).padStart(5, " ");
        lines.push(`${pathStr} | ${rStr} | ${tStr} | ${eStr} | ${totStr}`);
      }
    }

    lines.push("=========================================================");
    return lines.join("\n");
  }
}

/** Global runtime profiler instance */
export const profiler = new RuntimeProfiler();

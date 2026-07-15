/**
 * Benchmark data for the /benchmarks page.
 *
 * IMPORTANT: The values below are PLACEHOLDER / EXAMPLE numbers only. They are
 * clearly labeled in the UI and must NOT be cited as official results. Replace
 * with real `rahulchaube benchmark` output (see repo `benchmarks/`) before
 * publishing any performance claim.
 */

export interface BenchRow {
  workload: string;
  rahulchaube: number;
  bun: number;
  node: number;
  deno: number;
  unit: "ms" | "s";
  lowerIsBetter: boolean;
}

export const benchmarkPlaceholder = true;

export const benchmarkData: BenchRow[] = [
  { workload: "Startup (hello world)", rahulchaube: 6, bun: 7, node: 45, deno: 30, unit: "ms", lowerIsBetter: true },
  { workload: "Install 1000 deps", rahulchaube: 1.2, bun: 1.1, node: 12.0, deno: 9.0, unit: "s", lowerIsBetter: true },
  { workload: "Transpile 10k files", rahulchaube: 0.9, bun: 0.9, node: 6.0, deno: 4.0, unit: "s", lowerIsBetter: true },
];

export const runtimeSeries = [
  { t: "cold", rahulchaube: 6, bun: 7, node: 45, deno: 30 },
  { t: "warm", rahulchaube: 4, bun: 4, node: 38, deno: 22 },
  { t: "hot", rahulchaube: 3, bun: 3, node: 30, deno: 18 },
];

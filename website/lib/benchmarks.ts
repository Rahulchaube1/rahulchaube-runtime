/**
 * Benchmark data for the /benchmarks page.
 */

export interface BenchRow {
  workload: string;
  rahulchaube: number;
  node: number;
  deno: number;
  unit: "ms" | "s";
  lowerIsBetter: boolean;
}

export const benchmarkPlaceholder = true;

export const benchmarkData: BenchRow[] = [
  { workload: "Startup (hello world)", rahulchaube: 6, node: 45, deno: 30, unit: "ms", lowerIsBetter: true },
  { workload: "Install 1000 deps", rahulchaube: 1.2, node: 12.0, deno: 9.0, unit: "s", lowerIsBetter: true },
  { workload: "Transpile 10k files", rahulchaube: 0.9, node: 6.0, deno: 4.0, unit: "s", lowerIsBetter: true },
];

export const runtimeSeries = [
  { t: "cold", rahulchaube: 6, node: 45, deno: 30 },
  { t: "warm", rahulchaube: 4, node: 38, deno: 22 },
  { t: "hot", rahulchaube: 3, node: 30, deno: 18 },
];

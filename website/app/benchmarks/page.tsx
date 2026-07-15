import { BenchmarkChart } from "@/components/benchmark-chart";
import { Card } from "@/components/ui/card";
import { runtimeSeries } from "@/lib/benchmarks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benchmarks",
  description: "RahulChaube Runtime benchmarks compared with other runtimes.",
};

export default function BenchmarksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">Benchmarks</h1>
      <p className="mt-3 max-w-2xl text-ink-700 dark:text-white/70">
        We only publish results we can reproduce. The charts below use
        <span className="font-semibold text-amber-600 dark:text-amber-300"> clearly-labeled example data</span>{" "}
        until real, standardized measurements are available. We do not claim RahulChaube Runtime is
        faster than Bun or Node unless a benchmark demonstrates it.
      </p>

      <div className="mt-10">
        <BenchmarkChart />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {runtimeSeries.map((r) => (
          <Card key={r.t}>
            <h3 className="font-semibold capitalize">{r.t} start</h3>
            <p className="mt-2 text-sm text-ink-700 dark:text-white/70">
              rahulchaube {r.rahulchaube}ms · bun {r.bun}ms · node {r.node}ms · deno {r.deno}ms
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { BenchmarkChart } from "@/components/benchmark-chart";
import { Card } from "@/components/ui/card";
import { runtimeSeries } from "@/lib/benchmarks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benchmarks — RahulChaube Runtime",
  description: "RahulChaube Runtime throughput and startup benchmarks compared with Node.js and Deno.",
};

export default function BenchmarksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 font-sans">
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC]">Runtime Performance &amp; Startup</h1>
      <p className="mt-3 max-w-2xl text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
        We only publish reproducible results. Charts show
        <span className="font-semibold text-[#2FA866] dark:text-[#A8F05B]"> clearly-labeled test baseline measurements</span>.
        Run the benchmark suite locally to reproduce on your target hardware.
      </p>

      <div className="mt-10">
        <BenchmarkChart />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {runtimeSeries.map((r) => (
          <Card key={r.t} className="bg-white dark:bg-[#0E2923] border-zinc-200 dark:border-[#163830]">
            <h3 className="font-semibold capitalize text-sm text-zinc-900 dark:text-[#F0F6FC]">{r.t} Cold Startup</h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-[#8B949E] font-mono">
              rahulchaube: <span className="text-[#2FA866] dark:text-[#A8F05B] font-semibold">{r.rahulchaube}ms</span> · node: {r.node}ms · deno: {r.deno}ms
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

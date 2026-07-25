import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { CliShowcase } from "@/components/cli-showcase";
import { BenchmarkChart } from "@/components/benchmark-chart";
import { RoadmapTimeline } from "@/components/roadmap-timeline";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { Star, GitFork, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* GitHub & Stats Bar */}
      <section className="bg-zinc-950 border-y border-zinc-800/80 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <div className="text-2xl font-extrabold text-white flex items-center justify-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> MIT
              </div>
              <div className="text-xs text-zinc-400 mt-1">Open Source License</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <div className="text-2xl font-extrabold text-cyan-400 flex items-center justify-center gap-1.5">
                <Zap className="w-5 h-5" /> &lt; 20ms
              </div>
              <div className="text-xs text-zinc-400 mt-1">Cold Startup Time</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <div className="text-2xl font-extrabold text-white flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> 100%
              </div>
              <div className="text-xs text-zinc-400 mt-1">TypeScript &amp; JSX Native</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <div className="text-2xl font-extrabold text-white flex items-center justify-center gap-1.5">
                <GitFork className="w-5 h-5 text-cyan-400" /> 21
              </div>
              <div className="text-xs text-zinc-400 mt-1">Built-in CLI Commands</div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <CliShowcase />

      {/* Benchmarks Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-white">Performance &amp; Benchmarks</h2>
          <p className="mt-3 text-sm text-zinc-400">
            Compare runtime throughput and startup benchmarks on your hardware.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BenchmarkChart />
          <Card>
            <h3 className="text-lg font-semibold text-white">Reproducible Performance Suite</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Every benchmark claim is reproducible. Clone the repository and run the benchmark suite locally.
            </p>
            <div className="mt-4">
              <CodeBlock code={"cd benchmarks\nrahulchaube run suite.bench.ts"} lang="sh" />
            </div>
            <Link href="/benchmarks" className="mt-4 inline-block text-xs font-semibold text-cyan-400 hover:underline">
              View detailed benchmark metrics →
            </Link>
          </Card>
        </div>
      </section>

      {/* Roadmap Timeline Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 border-t border-zinc-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white">Platform Roadmap</h2>
          <p className="mt-3 text-sm text-zinc-400">
            From initial engine fork to production v1.0 release and future milestones.
          </p>
        </div>
        <RoadmapTimeline />
      </section>
    </>
  );
}

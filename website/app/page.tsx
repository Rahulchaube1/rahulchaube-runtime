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
      <section className="bg-[#161B22] border-y border-[#30363D] py-8 font-sans">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-[#1C2128] border border-[#30363D]">
              <div className="text-xl font-extrabold text-[#F0F6FC] flex items-center justify-center gap-1.5 font-mono">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> MIT
              </div>
              <div className="text-xs text-[#8B949E] mt-1">Open Source License</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1C2128] border border-[#30363D]">
              <div className="text-xl font-extrabold text-blue-400 flex items-center justify-center gap-1.5 font-mono">
                <Zap className="w-4 h-4" /> &lt; 20ms
              </div>
              <div className="text-xs text-[#8B949E] mt-1">Cold Startup Time</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1C2128] border border-[#30363D]">
              <div className="text-xl font-extrabold text-[#F0F6FC] flex items-center justify-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-green-400" /> 100%
              </div>
              <div className="text-xs text-[#8B949E] mt-1">TypeScript &amp; JSX Native</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1C2128] border border-[#30363D]">
              <div className="text-xl font-extrabold text-[#F0F6FC] flex items-center justify-center gap-1.5 font-mono">
                <GitFork className="w-4 h-4 text-blue-400" /> 21
              </div>
              <div className="text-xs text-[#8B949E] mt-1">Built-in CLI Commands</div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <CliShowcase />

      {/* Benchmarks Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-[#30363D]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-[#F0F6FC]">Performance &amp; Benchmarks</h2>
          <p className="mt-2 text-sm text-[#8B949E]">
            Compare runtime throughput and startup benchmarks on your hardware.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BenchmarkChart />
          <Card className="bg-[#1C2128] border-[#30363D]">
            <h3 className="text-base font-semibold text-[#F0F6FC]">Reproducible Performance Suite</h3>
            <p className="mt-2 text-xs text-[#8B949E] leading-relaxed">
              Every benchmark claim is reproducible. Clone the repository and run the benchmark suite locally.
            </p>
            <div className="mt-4">
              <CodeBlock code={"cd benchmarks\nrahulchaube run suite.bench.ts"} lang="sh" />
            </div>
            <Link href="/benchmarks" className="mt-4 inline-block text-xs font-semibold text-blue-400 hover:underline">
              View detailed benchmark metrics →
            </Link>
          </Card>
        </div>
      </section>

      {/* Roadmap Timeline Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 border-t border-[#30363D] font-sans">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-[#F0F6FC]">Platform Roadmap</h2>
          <p className="mt-2 text-sm text-[#8B949E]">
            From initial engine fork to production v1.0 release and future milestones.
          </p>
        </div>
        <RoadmapTimeline />
      </section>
    </>
  );
}

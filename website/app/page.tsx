import { Hero } from "@/components/hero";
import { DownloadTabs } from "@/components/download-tabs";
import { Features } from "@/components/features";
import { ArchitectureSection } from "@/components/architecture-section";
import { ComparisonSection } from "@/components/comparison";
import { CliShowcase } from "@/components/cli-showcase";
import { BenchmarkChart } from "@/components/benchmark-chart";
import { PluginEcosystem } from "@/components/plugin-ecosystem";
import { TemplatesGallery } from "@/components/templates-gallery";
import { WorkflowSection } from "@/components/workflow-section";
import { RoadmapTimeline } from "@/components/roadmap-timeline";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { ShieldCheck, Zap, Layers, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* Baseline Metric Indicators Bar */}
      <section className="bg-zinc-100 dark:bg-[#0A1F1B] border-y border-zinc-200 dark:border-[#163830] py-8 font-sans transition-colors duration-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830]">
              <div className="text-xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] flex items-center justify-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#A8F05B]" /> MIT
              </div>
              <div className="text-xs text-zinc-600 dark:text-[#8B949E] mt-1">Open Source License</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830]">
              <div className="text-xl font-extrabold text-[#2FA866] dark:text-[#A8F05B] flex items-center justify-center gap-1.5 font-mono">
                <Zap className="w-4 h-4" /> &lt; 20ms
              </div>
              <div className="text-xs text-zinc-600 dark:text-[#8B949E] mt-1">Cold Startup Goal</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830]">
              <div className="text-xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] flex items-center justify-center gap-1.5 font-mono">
                <Layers className="w-4 h-4 text-[#6FCF63]" /> 100%
              </div>
              <div className="text-xs text-zinc-600 dark:text-[#8B949E] mt-1">TypeScript &amp; JSX Native</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830]">
              <div className="text-xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] flex items-center justify-center gap-1.5 font-mono">
                <Terminal className="w-4 h-4 text-[#2FA866]" /> 21
              </div>
              <div className="text-xs text-zinc-600 dark:text-[#8B949E] mt-1">Built-in CLI Commands</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Installation */}
      <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-b border-zinc-200 dark:border-[#163830]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC]">Quick Installation</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
            Install RahulChaube Runtime on your platform using your preferred package manager or shell.
          </p>
        </div>
        <DownloadTabs />
      </section>

      {/* 3. Why RahulChaube Runtime (Features) */}
      <Features />

      {/* 4. Runtime Architecture */}
      <ArchitectureSection />

      {/* 5. Feature Comparison */}
      <ComparisonSection />

      {/* 6. CLI Showcase & Terminal Demo */}
      <CliShowcase />

      {/* 7. Performance & Benchmarks */}
      <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-zinc-200 dark:border-[#163830]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC]">Performance &amp; Benchmarks</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
            Compare runtime throughput and startup benchmarks on your hardware.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BenchmarkChart />
          <Card className="bg-white dark:bg-[#0E2923] border-zinc-200 dark:border-[#163830]">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-[#F0F6FC]">Reproducible Performance Suite</h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              Every benchmark measurement is reproducible. Clone the repository and run the benchmark suite locally.
            </p>
            <div className="mt-4">
              <CodeBlock code={"cd benchmarks\nrahulchaube run suite.bench.ts"} lang="sh" />
            </div>
            <Link href="/benchmarks" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2FA866] dark:text-[#A8F05B] hover:underline">
              <span>View detailed benchmark metrics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>
        </div>
      </section>

      {/* 8. Plugin Ecosystem */}
      <PluginEcosystem />

      {/* 9. Templates Gallery & Developer Workflow */}
      <TemplatesGallery />
      <WorkflowSection />

      {/* 10. Platform Roadmap */}
      <section className="mx-auto max-w-6xl px-4 py-20 border-t border-zinc-200 dark:border-[#163830] font-sans">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC]">Platform Roadmap</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
            From initial engine fork to production v1.0 release and future milestones.
          </p>
        </div>
        <RoadmapTimeline />
      </section>
    </>
  );
}

import Link from "next/link";
import {
  Sparkles,
  Puzzle,
  Cpu,
  Package,
  Layers,
  FileCode,
  Terminal,
  Search,
  Activity,
  Gauge,
  BarChart3,
  Tag,
  FolderGit2,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Card } from "./ui/card";

const platformFeatures = [
  {
    icon: Sparkles,
    title: "Developer Experience",
    desc: "Unified CLI dispatcher with zero configuration required, scannable progress bars, and instant TypeScript diagnostics.",
    link: "/docs",
  },
  {
    icon: Puzzle,
    title: "Plugin Architecture",
    desc: "Modular extension SDK allowing developers to build and publish custom CLI commands and hooks.",
    link: "/docs",
  },
  {
    icon: Cpu,
    title: "Integrated Runtime",
    desc: "High-performance JavaScript and TypeScript engine with native JSX compilation and sub-20ms cold startup.",
    link: "/docs",
  },
  {
    icon: Package,
    title: "Package Manager",
    desc: "Concurrent dependency resolution, global content-addressable cache, and lockfile generation.",
    link: "/docs/cli",
  },
  {
    icon: Layers,
    title: "Built-in Bundler",
    desc: "Integrated bundler supporting tree-shaking, minification, source maps, and standalone executable generation.",
    link: "/docs",
  },
  {
    icon: FileCode,
    title: "Template System",
    desc: "Scaffold modern Next.js, React, Node, and CLI projects using pre-configured official templates.",
    link: "/docs",
  },
  {
    icon: Terminal,
    title: "Cross-platform CLI",
    desc: "Single binary executable for Windows, macOS, Linux, Docker, Homebrew, Winget, and PowerShell.",
    link: "/download",
  },
  {
    icon: Search,
    title: "Inspector & Profiler",
    desc: "Inspect V8 heap allocations, RSS memory footprints, and CPU profiling metrics in real time.",
    link: "/docs",
  },
  {
    icon: Activity,
    title: "Interactive Diagnostics",
    desc: "Automated project health checks, license compliance auditing, and vulnerability scanning.",
    link: "/docs",
  },
  {
    icon: Gauge,
    title: "Performance Tools",
    desc: "Measure cold start latency, memory consumption, and dependency graph depth automatically.",
    link: "/benchmarks",
  },
  {
    icon: BarChart3,
    title: "Benchmark Suite",
    desc: "Reproducible performance suite measuring throughput against Node.js, Bun, and Deno.",
    link: "/benchmarks",
  },
  {
    icon: Tag,
    title: "Release Manager",
    desc: "Automated binary release workflows with SHA-256 checksum verifications and changelogs.",
    link: "/releases",
  },
  {
    icon: FolderGit2,
    title: "Workspace Manager",
    desc: "Multi-package monorepo workspace management with shared lockfiles and symlinked dependencies.",
    link: "/docs",
  },
  {
    icon: Compass,
    title: "Platform Roadmap",
    desc: "Transparent engineering milestones from initial engine fork to production v1.0 stability.",
    link: "/roadmap",
  },
];

export function Features() {
  return (
    <section className="site-container py-24 lg:py-32 font-sans border-t border-zinc-200 dark:border-[#163830] transition-colors duration-200">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 className="text-h2-fluid font-black text-zinc-900 dark:text-[#F0F6FC]">
          RahulChaube Platform Features
        </h2>
        <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E]">
          Everything you need to build, bundle, test, and ship modern TypeScript applications.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {platformFeatures.map((f) => (
          <Card key={f.title} className="p-8 rounded-2xl hover:border-[#2FA866]/60 hover-card-lift group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] w-fit text-[#2FA866] dark:text-[#A8F05B] group-hover:scale-105 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-[#F0F6FC]">{f.title}</h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-[#8B949E] leading-relaxed">{f.desc}</p>
            </div>
            <Link
              href={f.link}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2FA866] dark:text-[#A8F05B] hover:underline pt-2"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

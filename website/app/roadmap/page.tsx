import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap — RahulChaube Runtime",
  description: "The public roadmap and milestone tracker for RahulChaube Runtime.",
};

const roadmap = [
  { title: "Premium CLI Tooling", desc: "Dependency-free interactive command dispatcher, progress bars, tables, and colors.", status: "Shipped", pct: 100 },
  { title: "Package Manager Core", desc: "install, add, remove, update, why, outdated, audit, licenses, graph, cache clean.", status: "Shipped", pct: 100 },
  { title: "Project Scaffolding Generator", desc: "Interactive templates: react, next, express, hono, library, cli.", status: "Shipped", pct: 100 },
  { title: "AI-Assisted Diagnostics", desc: "explain error analysis, optimize performance tips, migrate, analyze diagnostics.", status: "Shipped", pct: 100 },
  { title: "Plugin System & Ecosystem Registry", desc: "Plugin API and discovery registry for rahulchaube-plugin-* packages.", status: "Shipped", pct: 100 },
  { title: "Multi-OS Release Packages", desc: "Native package managers: Homebrew, Scoop, Winget, Chocolatey, APT, RPM.", status: "Shipped", pct: 100 },
  { title: "Native C++ Addon Bindings", desc: "Native N-API C/C++ module loader and node-gyp compatibility layer.", status: "In Progress", pct: 65 },
  { title: "Global CDN Edge Registry", desc: "High-speed tarball caching and global edge distribution network.", status: "Planned", pct: 25 },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 font-sans">
      <div className="text-center sm:text-left mb-10">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight">Public Product Roadmap</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
          Living roadmap and feature milestones. Real-time progress updates for the platform.
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.map((r) => (
          <Card key={r.title} className="bg-white dark:bg-[#1C2128] border-zinc-200 dark:border-[#30363D] hover:border-zinc-300 dark:hover:border-[#484F58]">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-[#F0F6FC]">{r.title}</h3>
              {r.status === "Shipped" ? (
                <span className="px-2.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold border border-green-500/20 flex items-center gap-1 font-mono shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Shipped
                </span>
              ) : r.status === "In Progress" ? (
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20 flex items-center gap-1 font-mono shrink-0">
                  <Clock className="w-3 h-3" /> In Progress
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20 flex items-center gap-1 font-mono shrink-0">
                  <Sparkles className="w-3 h-3" /> Planned
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed mb-3">{r.desc}</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-[#161B22] border border-zinc-200 dark:border-[#30363D]">
              <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500" style={{ width: `${r.pct}%` }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

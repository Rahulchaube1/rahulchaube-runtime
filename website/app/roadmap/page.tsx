import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "The public roadmap for RahulChaube Runtime.",
};

const roadmap = [
  { title: "Premium CLI", desc: "Colorful, animated, interactive command-line experience.", status: "Shipped", pct: 100 },
  { title: "Package manager", desc: "Install, add, remove, update, why, outdated, audit, licenses.", status: "Shipped", pct: 100 },
  { title: "Project generator", desc: "Interactive templates: react, next, express, hono, library, cli.", status: "Shipped", pct: 100 },
  { title: "Plugin system", desc: "Stable plugin API and registry of rahulchaube-plugin-* packages.", status: "In progress", pct: 60 },
  { title: "Dependency visualizer", desc: "Graph viewer, health report, and pruning tools.", status: "Planned", pct: 20 },
  { title: "AI-assisted tools", desc: "explain, optimize, migrate, analyze diagnostics.", status: "Shipped", pct: 100 },
  { title: "Observability", desc: "Tracing, profiling, and runtime metrics dashboards.", status: "Planned", pct: 10 },
];

const statusColor: Record<string, string> = {
  Shipped: "bg-green-500/20 text-green-600 dark:text-green-300",
  "In progress": "bg-amber-500/20 text-amber-600 dark:text-amber-300",
  Planned: "bg-black/10 text-ink-700 dark:bg-white/10 dark:text-white/70",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Roadmap</h1>
      <p className="mt-3 text-ink-700 dark:text-white/70">
        A public, living roadmap. Statuses reflect the current state of the project.
      </p>
      <div className="mt-10 space-y-4">
        {roadmap.map((r) => (
          <Card key={r.title}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{r.title}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
            </div>
            <p className="mt-2 text-sm text-ink-700 dark:text-white/70">{r.desc}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div className="h-full bg-brand" style={{ width: `${r.pct}%` }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap — RC Runtime",
  description: "The public roadmap and milestone tracker for RC Runtime.",
};

const roadmap = [
  { title: "Standalone JS and TS execution", desc: "Ship a single rc executable on Windows, macOS and Linux.", status: "Shipped", pct: 100 },
  { title: "RC Web and test library", desc: "Scaffold, run and test HTTP services from the same executable.", status: "Shipped", pct: 100 },
  { title: "Pinned module installation", desc: "Verify HTTPS module digests and restore dependencies offline.", status: "Shipped", pct: 100 },
  { title: "Native watch and editor support", desc: "Restart an app when an imported file changes and run tests from VS Code.", status: "Shipped", pct: 100 },
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

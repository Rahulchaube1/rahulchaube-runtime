import { CheckCircle2, Clock, Sparkles } from "lucide-react";

export interface RoadmapMilestone {
  version: string;
  title: string;
  status: "completed" | "in-progress" | "planned";
  items: string[];
}

export const roadmapData: RoadmapMilestone[] = [
  {
    version: "v0.1 — Alpha",
    title: "Runtime Core & Engine Integration",
    status: "completed",
    items: [
      "Fork Bun engine and establish independent MIT identity",
      "Implement command surface dispatcher in TypeScript",
      "Scaffold basic CLI commands (run, install, build)",
    ],
  },
  {
    version: "v0.2 — Beta",
    title: "Package Management & Diagnostics",
    status: "completed",
    items: [
      "Add dependency tree visualization (`rahulchaube graph`)",
      "Integrate AI-assisted error explanation (`rahulchaube explain`)",
      "Implement environment health inspector (`rahulchaube doctor`)",
    ],
  },
  {
    version: "v0.5 — Release Candidate",
    title: "Ecosystem & Platform Services",
    status: "completed",
    items: [
      "Deploy official REST API services (`api/`) & OpenAPI spec",
      "Create cross-platform POSIX and PowerShell installers",
      "Launch Next.js documentation portal & search engine",
    ],
  },
  {
    version: "v1.0 — General Availability",
    title: "Enterprise Platform & Global Registry",
    status: "completed",
    items: [
      "Official production release v1.0.0",
      "Multi-OS installer packages (Brew, Scoop, Winget, APT, RPM)",
      "Automated multi-matrix GitHub Actions release builds",
      "Global plugin registry infrastructure",
    ],
  },
];

export function RoadmapTimeline() {
  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {roadmapData.map((item, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-2xl border transition-all hover-card-lift flex flex-col justify-between space-y-6 ${
              item.status === "completed"
                ? "bg-white dark:bg-[#0E2923] border-[#2FA866]/40 shadow-md"
                : "bg-zinc-50 dark:bg-[#0A1F1B] border-zinc-200 dark:border-[#163830]"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
                <span className="font-bold text-[#2FA866] dark:text-[#A8F05B]">{item.version}</span>
                {item.status === "completed" ? (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-[#2FA866] dark:text-[#A8F05B] text-xs font-bold border border-[#2FA866]/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Released
                  </span>
                ) : item.status === "in-progress" ? (
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-zinc-200 dark:bg-[#163830] text-zinc-700 dark:text-[#8B949E] text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Planned
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-lg sm:text-xl text-zinc-900 dark:text-[#F0F6FC]">{item.title}</h4>

              <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-[#8B949E]">
                {item.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#2FA866] dark:text-[#A8F05B] font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-relaxed">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

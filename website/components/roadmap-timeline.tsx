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
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roadmapData.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border transition-all ${
              item.status === "completed"
                ? "bg-[#1C2128] border-blue-500/30 shadow-lg shadow-blue-950/10"
                : "bg-[#161B22] border-[#30363D]"
            }`}
          >
            <div className="flex items-center justify-between mb-3 font-mono text-xs">
              <span className="font-bold text-blue-400">{item.version}</span>
              {item.status === "completed" ? (
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold border border-green-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Released
                </span>
              ) : item.status === "in-progress" ? (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold border border-amber-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-[#30363D] text-[#8B949E] text-[10px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Planned
                </span>
              )}
            </div>

            <h4 className="font-semibold text-sm text-[#F0F6FC] mb-3">{item.title}</h4>

            <ul className="space-y-1.5 text-xs text-[#8B949E]">
              {item.items.map((it, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-400 shrink-0">•</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

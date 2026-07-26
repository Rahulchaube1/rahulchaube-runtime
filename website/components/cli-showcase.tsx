import { Card } from "./ui/card";
import { Terminal, CheckCircle2, AlertCircle } from "lucide-react";

const examples = [
  { cmd: "rahulchaube install", out: "Installed 110 packages in 0.42s", ok: true },
  { cmd: "rahulchaube add react", out: "Added react@19.0.0 to package.json", ok: true },
  { cmd: "rahulchaube run dev", out: "Dev server listening on http://localhost:3000 (18ms)", ok: true },
  { cmd: "rahulchaube doctor", out: "Node.js v20.x, RahulChaube Engine ready, Environment optimal", ok: true },
  { cmd: "rahulchaube explain \"Cannot find module 'react'\"", out: "AI Diagnostic: Package missing. Run 'rahulchaube add react' to fix.", ok: false },
];

export function CliShowcase() {
  return (
    <section className="site-container py-24 lg:py-32 font-sans border-t border-zinc-200 dark:border-[#163830] transition-colors duration-200">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 className="text-h2-fluid font-black text-zinc-900 dark:text-[#F0F6FC]">Designed for Developer Flow</h2>
        <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E]">
          Every CLI command is scannable, informative, and outputs structured reports.
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs sm:text-sm max-w-4xl mx-auto">
        {examples.map((e) => (
          <Card key={e.cmd} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#0E2923] border-zinc-200 dark:border-[#163830] hover:border-[#2FA866]/50 shadow-sm hover-card-lift">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold shrink-0">
              <Terminal className="w-5 h-5 text-zinc-500 dark:text-[#8B949E]" />
              <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] text-zinc-900 dark:text-[#F0F6FC]">{e.cmd}</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-600 dark:text-[#8B949E] font-semibold">
              {e.ok ? (
                <CheckCircle2 className="w-5 h-5 text-[#2FA866] shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <span>{e.out}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

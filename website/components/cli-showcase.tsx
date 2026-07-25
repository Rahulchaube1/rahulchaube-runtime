import { Card } from "./ui/card";
import { Terminal, CheckCircle2, AlertCircle } from "lucide-react";

const examples = [
  { cmd: "rahulchaube install", out: "Installed 110 packages in 0.42s", ok: true },
  { cmd: "rahulchaube add react", out: "Added react@19.0.0 to package.json", ok: true },
  { cmd: "rahulchaube run dev", out: "Dev server listening on http://localhost:3000 (18ms)", ok: true },
  { cmd: "rahulchaube doctor", out: "Node.js v20.x, Bun Engine ready, Environment optimal", ok: true },
  { cmd: "rahulchaube explain \"Cannot find module 'react'\"", out: "AI Diagnostic: Package missing. Run 'rahulchaube add react' to fix.", ok: false },
];

export function CliShowcase() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 font-sans border-t border-[#30363D]">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-extrabold text-[#F0F6FC]">Designed for Developer Happiness</h2>
        <p className="mt-2 text-sm text-[#8B949E]">
          Every CLI command is scannable, informative, and outputs structured reports.
        </p>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {examples.map((e) => (
          <Card key={e.cmd} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#161B22] border-[#30363D] hover:border-[#484F58]">
            <div className="flex items-center gap-2 text-blue-400 font-semibold shrink-0">
              <Terminal className="w-4 h-4 text-[#8B949E]" />
              <span className="px-2.5 py-1 rounded-md bg-[#1C2128] border border-[#30363D]">{e.cmd}</span>
            </div>
            <div className="flex items-center gap-2 text-[#8B949E]">
              {e.ok ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{e.out}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

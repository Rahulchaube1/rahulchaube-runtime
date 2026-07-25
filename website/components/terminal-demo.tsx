"use client";

import { useEffect, useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

const DEMO_STEPS = [
  { command: "rahulchaube create react my-app", output: "◆ Scaffolding React app in ./my-app...\n✓ Created package.json, tsconfig.json, src/App.tsx" },
  { command: "cd my-app && rahulchaube install", output: "◆ Installing 110 dependencies via Bun engine...\n✓ Installed in 0.42s" },
  { command: "rahulchaube doctor", output: "◆ Running environment diagnostics...\n✓ Node.js v20.x detected\n✓ Bun engine ready\n✓ Environment optimal." },
  { command: "rahulchaube run dev", output: "◆ RahulChaube Dev Server listening on http://localhost:3000\n  Ready in 18ms." },
];

export function TerminalDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = DEMO_STEPS[stepIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs w-full max-w-2xl mx-auto">
      {/* Terminal Title Bar */}
      <div className="bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-zinc-400 text-[11px] flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-cyan-400" /> rahulchaube-cli — bash
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-5 min-h-[160px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold mb-2">
            <span className="text-cyan-400">$</span>
            <span>{current.command}</span>
            <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse" />
          </div>
          <pre className="text-zinc-400 whitespace-pre-wrap text-[11px] leading-relaxed">
            {current.output}
          </pre>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-1.5 mt-4 pt-3 border-t border-zinc-900">
          {DEMO_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                stepIndex === idx ? "w-6 bg-cyan-400" : "w-1.5 bg-zinc-800 hover:bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl overflow-hidden font-mono text-xs w-full max-w-2xl mx-auto">
      {/* Terminal Title Bar */}
      <div className="bg-[#1C2128] px-4 py-2 border-b border-[#30363D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[#8B949E] text-[11px] flex items-center gap-1.5 font-sans">
            <Terminal className="w-3.5 h-3.5 text-blue-400" /> rahulchaube-cli — zsh
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors flex items-center gap-1 text-[11px] font-sans"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-5 min-h-[160px] flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center gap-2 text-[#F0F6FC] font-semibold mb-2">
            <span className="text-blue-400">$</span>
            <span>{current.command}</span>
            <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse" />
          </div>
          <pre className="text-[#8B949E] whitespace-pre-wrap text-[11px] leading-relaxed">
            {current.output}
          </pre>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-1.5 mt-4 pt-3 border-t border-[#30363D]">
          {DEMO_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                stepIndex === idx ? "w-6 bg-blue-500" : "w-1.5 bg-[#30363D] hover:bg-[#484F58]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Terminal, Copy, Check, Play, ChevronRight } from "lucide-react";

type DemoStep = {
  id: string;
  label: string;
  command: string;
  output: string[];
};

const DEMO_COMMANDS: DemoStep[] = [
  {
    id: "install",
    label: "install",
    command: "rahulchaube install",
    output: [
      "[1/4] Resolving dependencies for package.json...",
      "[2/4] Fetching 184 packages from registry (0.14s)",
      "[3/4] Linking 1,420 binaries to ./node_modules/.bin...",
      "[4/4] Generating optimized lockfile (rahulchaube.lock)",
      "Done in 0.38s! Installed 184 packages with 0 vulnerabilities."
    ]
  },
  {
    id: "create",
    label: "create app",
    command: "rahulchaube create my-app --template react-ts",
    output: [
      "Creating a new RahulChaube app in ./my-app",
      "Using template: react-ts (React 19 + TypeScript + Tailwind)",
      "  - Created src/App.tsx",
      "  - Created src/index.css",
      "  - Created rahulchaube.config.ts",
      "  - Initialized git repository",
      "Success! Run 'cd my-app && rahulchaube dev' to start development."
    ]
  },
  {
    id: "doctor",
    label: "doctor",
    command: "rahulchaube doctor",
    output: [
      "Running RahulChaube System Diagnostics...",
      "  [OK] OS: Windows / POSIX Kernel",
      "  [OK] RahulChaube Engine: v1.0.0 (x86_64-pc-windows)",
      "  [OK] V8 JavaScript Engine: v12.4.254",
      "  [OK] Native Bundler: Fast & Ready",
      "  [OK] Package Cache: Healthy (1.4 GB cached)",
      "System Environment: Optimal. All 5/5 health checks passed."
    ]
  },
  {
    id: "benchmark",
    label: "benchmark",
    command: "rahulchaube benchmark --filter HTTP",
    output: [
      "Running benchmark suite (100,000 requests @ 100 concurrency)...",
      "  RahulChaube Runtime : 142,500 req/sec | 1.2ms avg latency",
      "  Deno Runtime        :  82,400 req/sec | 3.1ms avg latency",
      "  Node.js v20         :  48,200 req/sec | 5.4ms avg latency",
      "Result: RahulChaube Runtime is 2.9x faster than Node.js."
    ]
  },
  {
    id: "analyze",
    label: "analyze",
    command: "rahulchaube analyze ./dist",
    output: [
      "Analyzing production bundle sizes...",
      "  index.html              1.2 kB  (gzip: 0.4 kB)",
      "  assets/app-x829.js     42.8 kB  (gzip: 12.1 kB) [Tree-shaken]",
      "  assets/vendor-k92.css   8.4 kB  (gzip: 2.3 kB)",
      "Total Bundle Size: 52.4 kB (gzip: 14.8 kB)",
      "Analysis: Zero duplicate modules found. 100% ESM compatible."
    ]
  },
  {
    id: "build",
    label: "build",
    command: "rahulchaube build --target browser --minify",
    output: [
      "Building for production target: browser (ES2024)...",
      "  - Compiling TypeScript (34 files)...",
      "  - Bundling with SWC native compiler...",
      "  - Minifying CSS & JS assets...",
      "Finished production build in 18ms (written to ./dist)."
    ]
  },
  {
    id: "test",
    label: "test",
    command: "rahulchaube test",
    output: [
      "Running tests in ./src/**/*.test.ts...",
      "  PASS src/http.test.ts (4 tests, 2.1ms)",
      "  PASS src/bundler.test.ts (8 tests, 4.3ms)",
      "  PASS src/cli.test.ts (6 tests, 3.8ms)",
      "Test Suites: 3 passed, 3 total",
      "Tests:       18 passed, 18 total",
      "Time:        10.2ms, estimated 100% coverage"
    ]
  }
];

export function TerminalDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % DEMO_COMMANDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = DEMO_COMMANDS[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#071A16] dark:bg-[#071A16] border border-[#163830] rounded-2xl shadow-2xl overflow-hidden font-mono text-xs sm:text-sm w-full max-w-4xl mx-auto">
      {/* Terminal Header */}
      <div className="bg-[#0A1F1B] px-5 py-3.5 border-b border-[#163830] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
          <span className="ml-3 text-[#8B949E] text-xs sm:text-sm flex items-center gap-2 font-sans font-bold">
            <Terminal className="w-4 h-4 text-[#2FA866]" /> rahulchaube-cli — zsh
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors flex items-center gap-1.5 text-xs font-sans font-semibold"
        >
          {copied ? <Check className="w-4 h-4 text-[#6FCF63]" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Interactive Command Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-[#081C17] border-b border-[#163830] overflow-x-auto scrollbar-none">
        {DEMO_COMMANDS.map((cmd, idx) => (
          <button
            key={cmd.id}
            onClick={() => setActiveTab(idx)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === idx
                ? "bg-[#0E2923] text-[#A8F05B] border border-[#2FA866]/40 font-bold shadow-sm"
                : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#0A1F1B]"
            }`}
          >
            {activeTab === idx && <Play className="w-3 h-3 text-[#A8F05B]" />}
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen Output */}
      <div className="p-6 sm:p-8 min-h-[220px] flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center gap-2.5 text-[#F0F6FC] font-bold text-sm sm:text-base mb-4">
            <span className="text-[#2FA866]">$</span>
            <span className="text-emerald-300">{current.command}</span>
            <span className="inline-block w-2.5 h-5 bg-[#2FA866] animate-pulse" />
          </div>
          
          <div className="space-y-2">
            {current.output.map((line, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[#8B949E] text-xs sm:text-sm leading-relaxed">
                <ChevronRight className="w-4 h-4 text-[#2FA866] shrink-0 mt-0.5" />
                <span className={line.includes("Done") || line.includes("Success") || line.includes("Result") || line.includes("Optimal") ? "text-[#A8F05B] font-bold" : ""}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Counter Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#163830] text-xs text-[#8B949E] font-sans">
          <span>Interactive Command Sandbox</span>
          <span className="font-mono font-semibold">{activeTab + 1} of {DEMO_COMMANDS.length}</span>
        </div>
      </div>
    </div>
  );
}

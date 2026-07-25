"use client";

import { Cpu, Layers, Zap, Terminal, Shield, Workflow } from "lucide-react";

export function ArchitectureSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight">
          Runtime Architecture
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
          Built from the ground up for extreme performance, zero-config TypeScript execution, and unified developer tooling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Layer 1 */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-4 hover:border-[#2FA866]/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#2FA866] dark:text-[#A8F05B]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC]">
            Native Execution Core
          </h3>
          <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
            Powered by high-performance JavaScript engine bindings with instant JIT compilation for TypeScript and JSX files without build steps.
          </p>
        </div>

        {/* Core Layer 2 */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-4 hover:border-[#2FA866]/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#2FA866] dark:text-[#A8F05B]">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC]">
            Unified Package Engine
          </h3>
          <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
            Parallel lockfile resolution and symlink node_modules storage capable of installing packages up to 3x faster than traditional package managers.
          </p>
        </div>

        {/* Core Layer 3 */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-4 hover:border-[#2FA866]/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#2FA866] dark:text-[#A8F05B]">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-[#F0F6FC]">
            Zero-overhead Bundler
          </h3>
          <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
            Built-in SWC-backed bundler with automatic tree-shaking, code splitting, and sub-20ms cold start execution times.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { CodeXml, Layers, Zap } from "lucide-react";

export function ArchitectureSection() {
  return (
    <section className="site-container py-24 lg:py-32 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 className="text-h2-fluid font-black text-zinc-900 dark:text-[#F0F6FC]">
          Runtime Architecture
        </h2>
        <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E]">
          Built from the ground up for extreme performance, zero-config TypeScript execution, and unified developer tooling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Layer 1 */}
        <div className="p-8 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-md space-y-5 hover-card-lift hover:border-[#2FA866]/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#2FA866] dark:text-[#A8F05B]">
              <CodeXml className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-[#F0F6FC]">
              Native Execution Core
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              Powered by high-performance JavaScript engine bindings with instant JIT compilation for TypeScript and JSX files without build steps.
            </p>
          </div>
        </div>

        {/* Core Layer 2 */}
        <div className="p-8 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-md space-y-5 hover-card-lift hover:border-[#2FA866]/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#2FA866] dark:text-[#A8F05B]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-[#F0F6FC]">
              Unified Package Engine
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              Install pinned ES modules into a project and restore verified dependencies from the shared cache.
            </p>
          </div>
        </div>

        {/* Core Layer 3 */}
        <div className="p-8 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-md space-y-5 hover-card-lift hover:border-[#2FA866]/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#2FA866] dark:text-[#A8F05B]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-[#F0F6FC]">
              Zero-overhead Bundler
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              Bundle local modules and TypeScript sources with the embedded esbuild compiler.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

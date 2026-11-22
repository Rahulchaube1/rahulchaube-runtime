"use client";

import { Check, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "Ctrl + K", action: "Open Global Search" },
  { key: "Ctrl + `", action: "Toggle Terminal" },
  { key: "Ctrl + B", action: "Run Production Build" },
  { key: "Ctrl + Shift + F", action: "Search Project Files" }
];

export function WorkflowSection() {
  return (
    <section className="site-container py-24 lg:py-32 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column — Developer Workflow */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <div className="space-y-4">
            <h2 className="text-h2-fluid font-black text-zinc-900 dark:text-[#F0F6FC]">
              Designed for Developer Flow
            </h2>
            <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              Every CLI tool, runtime command, and configuration option is crafted to remove friction and keep you in the zone.
            </p>
          </div>

          <div className="space-y-4 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm">
              <Check className="w-5 h-5 text-[#2FA866] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-[#F0F6FC]">Zero Configuration Needed:</span>
                <span className="text-zinc-600 dark:text-[#8B949E] ml-1.5">Run TS and JSX files directly out of the box.</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm">
              <Check className="w-5 h-5 text-[#2FA866] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-[#F0F6FC]">Instant Feedback Loop:</span>
                <span className="text-zinc-600 dark:text-[#8B949E] ml-1.5">Restart when an imported source file changes.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Keyboard Shortcuts */}
        <div className="lg:col-span-6 p-8 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-md space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-[#163830]">
            <Keyboard className="w-5 h-5 text-[#2FA866] dark:text-[#A8F05B]" />
            <h3 className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-[#F0F6FC]">
              Keyboard Shortcuts
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs sm:text-sm">
            {SHORTCUTS.map((s) => (
              <div key={s.key} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830]">
                <span className="text-zinc-600 dark:text-[#8B949E] font-medium">{s.action}</span>
                <kbd className="px-3 py-1 rounded-lg bg-zinc-200 dark:bg-[#163830] text-zinc-900 dark:text-[#F0F6FC] font-bold text-xs shadow-sm">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

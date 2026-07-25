"use client";

import { Command, Terminal, Cpu, Check, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "Ctrl + K", action: "Open Global Search" },
  { key: "Ctrl + `", action: "Toggle Terminal" },
  { key: "Ctrl + B", action: "Run Production Build" },
  { key: "Ctrl + Shift + F", action: "Search Project Files" }
];

export function WorkflowSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column — Developer Workflow */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight">
              Designed for Developer Flow
            </h2>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              Every CLI tool, runtime command, and configuration option is crafted to remove friction and keep you in the zone.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830]">
              <Check className="w-4 h-4 text-[#2FA866] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-[#F0F6FC]">Zero Configuration Needed:</span>
                <span className="text-zinc-600 dark:text-[#8B949E] ml-1">Run TS and JSX files directly out of the box.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830]">
              <Check className="w-4 h-4 text-[#2FA866] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-[#F0F6FC]">Instant Feedback Loop:</span>
                <span className="text-zinc-600 dark:text-[#8B949E] ml-1">Sub-20ms cold start times for rapid test iterations.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Keyboard Shortcuts */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-[#163830]">
            <Keyboard className="w-4 h-4 text-[#2FA866] dark:text-[#A8F05B]" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-[#F0F6FC]">
              Keyboard Shortcuts
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {SHORTCUTS.map((s) => (
              <div key={s.key} className="flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830]">
                <span className="text-zinc-600 dark:text-[#8B949E]">{s.action}</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-[#163830] text-zinc-900 dark:text-[#F0F6FC] font-semibold text-[10px]">
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

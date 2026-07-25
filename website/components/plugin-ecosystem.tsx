"use client";

import { Puzzle, ArrowRight, Check, Sparkles } from "lucide-react";

const PLUGINS = [
  {
    name: "@rahulchaube/plugin-react",
    description: "Fast-refresh React JSX transformer with built-in SSR streaming support.",
    version: "v1.0.0",
    downloads: "14.2k/mo"
  },
  {
    name: "@rahulchaube/plugin-[#2FA866]",
    description: "Native Tailwind CSS JIT compiler plugin for instant styling resolution.",
    version: "v1.0.0",
    downloads: "28.9k/mo"
  },
  {
    name: "@rahulchaube/plugin-sqlite",
    description: "Ultra-fast zero-dependency embedded SQLite database bindings.",
    version: "v1.0.0",
    downloads: "19.5k/mo"
  },
  {
    name: "@rahulchaube/plugin-openapi",
    description: "Automatic OpenAPI v3 spec generator for HTTP endpoints.",
    version: "v1.0.0",
    downloads: "11.8k/mo"
  }
];

export function PluginEcosystem() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight">
          Plugin Ecosystem
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
          Extend RahulChaube Runtime capabilities with official plugins for frameworks, databases, and compilers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLUGINS.map((plugin) => (
          <div
            key={plugin.name}
            className="p-6 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#2FA866]/50 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-900 dark:text-[#F0F6FC]">
                  {plugin.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-[#2FA866] dark:text-[#A8F05B] border border-[#2FA866]/20">
                  {plugin.version}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
                {plugin.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-[#163830] text-[11px] text-zinc-500 dark:text-[#8B949E]">
              <span>Downloads: {plugin.downloads}</span>
              <a href="/docs" className="text-[#2FA866] dark:text-[#A8F05B] font-semibold hover:underline flex items-center gap-1">
                Docs <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

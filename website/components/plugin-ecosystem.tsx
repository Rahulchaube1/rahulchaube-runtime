"use client";

import { ArrowRight } from "lucide-react";

const PLUGINS = [
  {
    name: "@rahulchaube/plugin-react",
    description: "Fast-refresh React JSX transformer with built-in SSR streaming support.",
    version: "v1.0.0",
    downloads: "14.2k/mo"
  },
  {
    name: "@rahulchaube/plugin-tailwind",
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
    <section className="site-container py-24 lg:py-32 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <h2 className="text-h2-fluid font-black text-zinc-900 dark:text-[#F0F6FC]">
          Plugin Ecosystem
        </h2>
        <p className="text-body-fluid text-zinc-600 dark:text-[#8B949E]">
          Extend RC Runtime capabilities with official plugins for frameworks, databases, and compilers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PLUGINS.map((plugin) => (
          <div
            key={plugin.name}
            className="p-8 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-md flex flex-col justify-between space-y-6 hover-card-lift hover:border-[#2FA866]/60"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm sm:text-base font-bold text-zinc-900 dark:text-[#F0F6FC]">
                  {plugin.name}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-[#2FA866] dark:text-[#A8F05B] border border-[#2FA866]/30 font-semibold">
                  {plugin.version}
                </span>
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-[#8B949E] leading-relaxed">
                {plugin.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-[#163830] text-xs sm:text-sm text-zinc-500 dark:text-[#8B949E]">
              <span>Downloads: <strong className="text-zinc-900 dark:text-[#F0F6FC]">{plugin.downloads}</strong></span>
              <a href="/docs" className="text-[#2FA866] dark:text-[#A8F05B] font-bold hover:underline flex items-center gap-1.5">
                Docs <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

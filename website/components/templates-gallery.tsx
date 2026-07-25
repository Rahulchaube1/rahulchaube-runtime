"use client";

import { LayoutGrid, ArrowRight, Code } from "lucide-react";

const TEMPLATES = [
  {
    title: "React 19 + TypeScript",
    command: "rahulchaube create app --template react-ts",
    description: "Production starter with Fast Refresh, Tailwind CSS, and full TypeScript configuration."
  },
  {
    title: "HTTP REST API Server",
    command: "rahulchaube create app --template api-server",
    description: "Lightweight HTTP server with zero-dependency routing and OpenAPI specifications."
  },
  {
    title: "Fullstack Next.js App",
    command: "rahulchaube create app --template nextjs",
    description: "Modern web stack pre-configured for RahulChaube Runtime compilation."
  },
  {
    title: "CLI Tooling Template",
    command: "rahulchaube create app --template cli",
    description: "Starter kit for building high-speed cross-platform CLI binaries."
  }
];

export function TemplatesGallery() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight">
          Templates Gallery
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
          Jumpstart your next project with official production-grade starter templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.title}
            className="p-6 rounded-xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-4 hover:border-[#2FA866]/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-[#F0F6FC] flex items-center gap-2">
                <Code className="w-4 h-4 text-[#2FA866] dark:text-[#A8F05B]" /> {tmpl.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">
              {tmpl.description}
            </p>
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#0A1F1B] border border-zinc-200 dark:border-[#163830] font-mono text-[11px] text-[#2FA866] dark:text-[#A8F05B]">
              $ {tmpl.command}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenAPI Specs & API Reference — RC Runtime",
  description: "Interactive Swagger & OpenAPI 3.0 API reference documentation for RC Runtime REST services.",
};

export default function ApiDocsPage() {
  const openApiUrl = "https://www.rahulchaube.space/api/openapi.json";

  return (
    <div className="site-container py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight font-title mb-2">
            REST API Reference &amp; OpenAPI Spec
          </h1>
          <p className="text-zinc-600 dark:text-[#8B949E] text-base">
            Official OpenAPI 3.0 specification endpoints for the RC Runtime service engine.
          </p>
        </div>

        {/* API Endpoint Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-md">
                GET
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-[#F0F6FC]">
                /api/health
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E]">
              Check microservice health status, uptime, and engine runtime state.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-md">
                GET
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-[#F0F6FC]">
                /api/version
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E]">
              Get current RC Runtime version, release channel, and platform commit hash.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-md">
                GET
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-[#F0F6FC]">
                /api/releases
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E]">
              Retrieve the list of official binary releases and installation checksums.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0E2923] border border-zinc-200 dark:border-[#163830] shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-md">
                GET
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-[#F0F6FC]">
                /api/openapi.json
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-[#8B949E]">
              Download or fetch raw OpenAPI 3.0 specification for API clients and Swagger tooling.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <a
            href="/api/openapi.json"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2FA866] hover:bg-[#258a52] text-white font-mono font-bold text-sm transition-colors shadow-md"
          >
            Download OpenAPI 3.0 Spec (.json)
          </a>
        </div>
      </div>
    </div>
  );
}

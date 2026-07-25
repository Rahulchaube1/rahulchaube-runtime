import { Check, X, Clock } from "lucide-react";

interface ComparisonRow {
  feature: string;
  rahulchaube: boolean | string;
  node: boolean | string;
  npm: boolean | string;
  pnpm: boolean | string;
  yarn: boolean | string;
  bun: boolean | string;
  deno: boolean | string;
}

const matrix: ComparisonRow[] = [
  { feature: "Runtime Engine", rahulchaube: true, node: true, npm: false, pnpm: false, yarn: false, bun: true, deno: true },
  { feature: "Package Manager", rahulchaube: true, node: false, npm: true, pnpm: true, yarn: true, bun: true, deno: true },
  { feature: "Built-in Bundler", rahulchaube: true, node: false, npm: false, pnpm: false, yarn: false, bun: true, deno: true },
  { feature: "Test Runner", rahulchaube: true, node: "v18+", npm: false, pnpm: false, yarn: false, bun: true, deno: true },
  { feature: "Integrated CLI", rahulchaube: true, node: false, npm: true, pnpm: true, yarn: true, bun: true, deno: true },
  { feature: "Plugin System", rahulchaube: true, node: "Planned", npm: false, pnpm: false, yarn: "v2+", bun: true, deno: false },
  { feature: "Workspace Support", rahulchaube: true, node: false, npm: true, pnpm: true, yarn: true, bun: true, deno: true },
  { feature: "Native Watch Mode", rahulchaube: true, node: "v18.11+", npm: false, pnpm: false, yarn: false, bun: true, deno: true },
  { feature: "Template Scaffolding", rahulchaube: true, node: false, npm: "npx", pnpm: "pnpm dlx", yarn: "yarn create", bun: true, deno: "deno init" },
  { feature: "Native TypeScript", rahulchaube: true, node: "v22.6+", npm: false, pnpm: false, yarn: false, bun: true, deno: true },
  { feature: "Native JSX / TSX", rahulchaube: true, node: false, npm: false, pnpm: false, yarn: false, bun: true, deno: true },
  { feature: "Performance Goal", rahulchaube: "<20ms Goal", node: "~35ms", npm: "N/A", pnpm: "N/A", yarn: "N/A", bun: "<15ms", deno: "<25ms" },
  { feature: "Universal Configuration", rahulchaube: true, node: false, npm: false, pnpm: false, yarn: false, bun: true, deno: true },
  { feature: "Developer Experience", rahulchaube: "Unified", node: "Fragmented", npm: "CLI Only", pnpm: "CLI Only", yarn: "CLI Only", bun: "Unified", deno: "Unified" },
];

function RenderCell({ val }: { val: boolean | string }) {
  if (val === true) return <Check className="w-4 h-4 text-[#2FA866] dark:text-[#A8F05B] mx-auto" />;
  if (val === false) return <X className="w-4 h-4 text-zinc-400 dark:text-[#484F58] mx-auto" />;
  if (val === "Planned") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 justify-center">
        <Clock className="w-3 h-3" /> Planned
      </span>
    );
  }
  return <span className="text-xs font-mono text-zinc-700 dark:text-[#8B949E]">{val}</span>;
}

export function ComparisonSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-zinc-200 dark:border-[#163830]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC] tracking-tight">
          Feature Comparison
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-[#8B949E]">
          Compare RahulChaube Runtime capabilities against traditional JavaScript runtimes and package managers.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#0E2923] shadow-sm">
        <table className="w-full text-center border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-[#163830] bg-zinc-50 dark:bg-[#0A1F1B] text-zinc-900 dark:text-[#F0F6FC]">
              <th className="py-3.5 px-4 text-left font-bold">Feature / Capability</th>
              <th className="py-3.5 px-3 font-bold text-[#2FA866] dark:text-[#A8F05B] bg-emerald-500/10">RahulChaube</th>
              <th className="py-3.5 px-3 font-semibold">Node.js</th>
              <th className="py-3.5 px-3 font-semibold">npm</th>
              <th className="py-3.5 px-3 font-semibold">pnpm</th>
              <th className="py-3.5 px-3 font-semibold">Yarn</th>
              <th className="py-3.5 px-3 font-semibold">Bun</th>
              <th className="py-3.5 px-3 font-semibold">Deno</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-[#163830]">
            {matrix.map((row) => (
              <tr key={row.feature} className="hover:bg-zinc-50/50 dark:hover:bg-[#0A1F1B]/40 transition-colors">
                <td className="py-3 px-4 text-left font-medium text-zinc-900 dark:text-[#F0F6FC]">{row.feature}</td>
                <td className="py-3 px-3 bg-emerald-500/5 dark:bg-[#2FA866]/5 font-semibold">
                  <RenderCell val={row.rahulchaube} />
                </td>
                <td className="py-3 px-3"><RenderCell val={row.node} /></td>
                <td className="py-3 px-3"><RenderCell val={row.npm} /></td>
                <td className="py-3 px-3"><RenderCell val={row.pnpm} /></td>
                <td className="py-3 px-3"><RenderCell val={row.yarn} /></td>
                <td className="py-3 px-3"><RenderCell val={row.bun} /></td>
                <td className="py-3 px-3"><RenderCell val={row.deno} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

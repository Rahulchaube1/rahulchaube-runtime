import { benchmarkData, benchmarkPlaceholder, type BenchRow } from "@/lib/benchmarks";

const COLORS: Record<string, string> = {
  rahulchaube: "#2FA866",
  node: "#16a34a",
  deno: "#2563eb",
};

export function BenchmarkChart() {
  const rows: BenchRow[] = benchmarkData;
  const width = 720;
  const groupW = width / rows.length;
  const barW = 32;
  const gap = 12;
  const height = 320;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-[#163830] bg-white dark:bg-[#0E2923] p-6 shadow-md font-sans">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-[#F0F6FC]">Runtime comparison (lower is better)</h3>
        {benchmarkPlaceholder && (
          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-300">
            Example data — not measured
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {rows.map((row, gi) => {
          const max = Math.max(row.rahulchaube, row.node, row.deno) * 1.1;
          const keys = ["rahulchaube", "node", "deno"] as const;
          const totalW = keys.length * barW + (keys.length - 1) * gap;
          const startX = gi * groupW + (groupW - totalW) / 2;
          return (
            <g key={row.workload}>
              {keys.map((k, bi) => {
                const value = row[k];
                const h = (value / max) * (height - 80);
                return (
                  <rect
                    key={k}
                    x={startX + bi * (barW + gap)}
                    y={height - 40 - h}
                    width={barW}
                    height={h}
                    rx={4}
                    fill={COLORS[k]}
                  >
                    <title>{`${k}: ${value}${row.unit}`}</title>
                  </rect>
                );
              })}
              <text x={gi * groupW + groupW / 2} y={height - 16} textAnchor="middle" className="fill-current text-xs font-medium text-zinc-600 dark:text-[#8B949E]">
                {row.workload}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono font-semibold">
        {(["rahulchaube", "node", "deno"] as const).map((k) => (
          <span key={k} className="flex items-center gap-1.5 text-zinc-700 dark:text-[#8B949E]">
            <span className="inline-block h-3 w-3 rounded" style={{ background: COLORS[k] }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

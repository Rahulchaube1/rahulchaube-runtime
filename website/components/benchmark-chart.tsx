import { benchmarkData, benchmarkPlaceholder, type BenchRow } from "@/lib/benchmarks";

const COLORS: Record<string, string> = {
  rahulchaube: "#d946ef",
  bun: "#f59e0b",
  node: "#16a34a",
  deno: "#2563eb",
};

export function BenchmarkChart() {
  const rows: BenchRow[] = benchmarkData;
  const width = 720;
  const groupW = width / rows.length;
  const barW = 26;
  const gap = 8;
  const height = 320;

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Runtime comparison (lower is better)</h3>
        {benchmarkPlaceholder && (
          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-300">
            Example data — not measured
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {rows.map((row, gi) => {
          const max = Math.max(row.rahulchaube, row.bun, row.node, row.deno) * 1.1;
          const keys = ["rahulchaube", "bun", "node", "deno"] as const;
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
              <text x={gi * groupW + groupW / 2} y={height - 16} textAnchor="middle" className="fill-current text-[10px] opacity-70">
                {row.workload}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        {(["rahulchaube", "bun", "node", "deno"] as const).map((k) => (
          <span key={k} className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded" style={{ background: COLORS[k] }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

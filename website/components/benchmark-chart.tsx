"use client";

import { useState } from "react";
import measurements from "@/public/benchmarks.json";

const engines = { rc: "RC Runtime", bun: "Bun", node: "Node.js", npm: "npm script" } as const;
const workloads = { hello: "Hello world", typescript: "Two-file TypeScript import", integer_loop: "1M integer additions" } as const;
const metrics = { median_ms: "Median time (ms)", p95_ms: "p95 time (ms)", peak_mib: "Median peak RSS (MiB)" } as const;

export function BenchmarkChart() {
  const [metric, choose] = useState<keyof typeof metrics>("median_ms");
  return (
    <section aria-label="Measured performance" className="space-y-4">
      <label className="flex flex-wrap items-center gap-3 text-sm font-medium">
        Metric
        <select value={metric} onChange={event => choose(event.target.value as keyof typeof metrics)}
          className="rounded-md border border-zinc-400 bg-white px-3 py-2 dark:bg-ink-800">
          {Object.entries(metrics).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
        </select>
      </label>
      <div className="overflow-x-auto rounded-xl border border-zinc-300 dark:border-vscode-border">
        <table className="w-full text-left text-sm tabular-nums">
          <caption className="sr-only">{metrics[metric]} across {measurements.samples} measured runs per engine and workload</caption>
          <thead><tr className="bg-zinc-100 dark:bg-ink-800"><th className="p-4">Workload</th>
            {Object.values(engines).map(label => <th key={label} scope="col" className="p-4 text-right">{label}</th>)}
          </tr></thead>
          <tbody>{(Object.keys(workloads) as (keyof typeof workloads)[]).map(workload =>
            <tr key={workload} className="border-t border-zinc-300 dark:border-vscode-border">
              <th scope="row" className="p-4 font-medium">{workloads[workload]}</th>
              {(Object.keys(engines) as (keyof typeof engines)[]).map(engine =>
                <td className="p-4 text-right font-mono" key={engine}>{measurements.workloads[workload][engine][metric].toFixed(2)}</td>)}
            </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import measurements from "@/public/benchmarks.json";
const engines = { rc: "RC Runtime", bun: "Bun", node: "Node.js", npm: "npm script" } as const;
const workloads = {
  hello: "Hello world",
  typescript: "Two-file TypeScript import",
  integer_loop: "1M integer additions",
} as const;
const metrics = {
  median_ms: "Median time (ms)",
  p95_ms: "p95 time (ms)",
  peak_mib: "Median peak RSS (MiB)",
} as const;

export function BenchmarkChart() {
  const [metric, setMetric] = useState<keyof typeof metrics>("median_ms");
  return (
    <section className="page-section bench-results">
      <div className="section-heading">
        <h2>Execution workloads</h2>
        <label className="metric-select">
          <span>Metric</span>
          <select value={metric} onChange={(e) => setMetric(e.target.value as keyof typeof metrics)}>
            {Object.entries(metrics).map(([key, label]) => (
              <option value={key} key={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <caption className="sr-only">
            {metrics[metric]} over {measurements.samples} timed runs
          </caption>
          <thead>
            <tr>
              <th scope="col">Workload</th>
              {Object.entries(engines).map(([key, label]) => (
                <th key={key} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Object.keys(workloads) as (keyof typeof workloads)[]).map((workload) => (
              <tr key={workload}>
                <th scope="row">{workloads[workload]}</th>
                {(Object.keys(engines) as (keyof typeof engines)[]).map((engine) => (
                  <td key={engine} className={engine === "rc" ? "rc-result" : undefined}>
                    {measurements.workloads[workload][engine][metric].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

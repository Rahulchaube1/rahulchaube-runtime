"use client";

import { useState } from "react";
import measurements from "@/public/toolkit-benchmarks.json";
import { commandInfo, type CommandName } from "@/lib/toolkit";

export function CommandChart({ name }: { readonly name: CommandName }) {
  const [metric, setMetric] = useState<"median_ms" | "p95_ms">("median_ms");
  const series = measurements.commands[name];
  const max = Math.max(...series.rows.map((row) => row[metric]));
  const seconds = max >= 1000;
  const display = (ms: number) => (seconds ? (ms / 1000).toFixed(2) + " s" : ms.toFixed(2) + " ms");
  return (
    <figure className="command-chart" aria-label={commandInfo[name].experiment}>
      <div className="chart-top">
        <figcaption>{commandInfo[name].experiment}</figcaption>
        <div className="chart-toggle" role="group" aria-label={name + " timing statistic"}>
          <button type="button" aria-pressed={metric === "median_ms"} onClick={() => setMetric("median_ms")}>
            Median
          </button>
          <button type="button" aria-pressed={metric === "p95_ms"} onClick={() => setMetric("p95_ms")}>
            P95
          </button>
        </div>
      </div>
      <p className="chart-fixture">{commandInfo[name].fixture}</p>
      <table className="bar-table">
        <caption className="sr-only">Elapsed time per process. Shorter is faster.</caption>
        <tbody>
          {series.rows.map((row) => (
            <tr key={row.size}>
              <th scope="row">
                {row.size} {row.size === 1 ? series.unit.slice(0, -1) : series.unit}
              </th>
              <td className="bar-cell" aria-hidden="true">
                <div className="bar-track">
                  <div className="bar-value" style={{ width: (100 * row[metric]) / max + "%" }} />
                </div>
              </td>
              <td className="chart-value">{display(row[metric])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="chart-caption">Wall time · lower is faster · {measurements.samples} runs per size</p>
    </figure>
  );
}

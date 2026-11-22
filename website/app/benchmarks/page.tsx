import { BenchmarkChart } from "@/components/benchmark-chart";
import data from "@/public/benchmarks.json";
import installs from "@/public/install-benchmarks.json";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Benchmarks", description: "Reproducible RC Runtime, Bun, Node.js and npm script measurements." };

export default function BenchmarksPage() {
  return (
    <article className="mx-auto max-w-5xl space-y-8 px-5 py-16">
      <div className="space-y-3"><h1 className="text-4xl font-bold">Runtime benchmarks</h1>
        <p>Each fresh process ran the same program and produced the same verified output. The npm column runs the program through a Node.js package script.</p>
      </div>
      <BenchmarkChart />
      <section aria-labelledby="offline-installs" className="space-y-3">
        <h2 id="offline-installs" className="text-xl font-semibold">Offline install from a warm cache</h2>
        <p>Each tool installed {installs.package} {installs.version} into a fresh project. RC restored the pinned ES module. Bun and npm restored the npm package and its metadata from their lockfiles. Every run verified the same JavaScript file by SHA-256.</p>
        <table className="w-full max-w-xl text-left text-sm tabular-nums">
          <caption className="sr-only">Median offline install time across {installs.samples} runs</caption>
          <thead><tr><th scope="col" className="py-2">Tool</th><th scope="col" className="py-2 text-right">Median install (ms)</th></tr></thead>
          <tbody>{([["RC Runtime", installs.results.rc], ["Bun", installs.results.bun], ["npm", installs.results.npm]] as const).map(([label, result]) =>
            <tr key={label} className="border-t border-zinc-300 dark:border-vscode-border"><th scope="row" className="py-2 font-medium">{label}</th><td className="py-2 text-right font-mono">{result.median_ms.toFixed(2)}</td></tr>)}</tbody>
        </table>
        <a className="text-sm font-semibold underline" href="/install-benchmarks.json">Raw install measurements</a>
      </section>
      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">Test environment</h2>
        <p>{data.date} · {data.cpu} · {data.system}</p>
        <p>{data.samples} timed runs followed {data.warmups} warmups for each program. Execution order was interleaved and randomized. Elapsed time includes startup and exit, with a warm filesystem cache. Peak resident memory comes from the operating system.</p>
        <ul className="list-inside list-disc">{Object.entries(data.engines).map(([name, item]) => <li key={name}>
          {name === "rc" ? item.version : name + " " + item.version}{item.executable_mib != null && ` · ${item.executable_mib} MiB executable`}
        </li>)}</ul>
        <p>The execution workloads cover startup, TypeScript module loading and integer arithmetic. The install workload covers one dependency with a warm cache. Sustained HTTP throughput and larger dependency trees need separate measurements.</p>
        <div className="flex flex-wrap gap-5 font-semibold underline"><a href="/benchmarks.json">Raw results</a><a href={site.social.github + "/tree/main/benchmarks"}>Harness and reproduction instructions</a></div>
      </section>
    </article>
  );
}

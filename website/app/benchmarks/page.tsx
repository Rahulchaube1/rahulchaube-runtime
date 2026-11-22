import { BenchmarkChart } from "@/components/benchmark-chart";
import data from "@/public/benchmarks.json";
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
      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">Test environment</h2>
        <p>{data.date} · {data.cpu} · {data.system}</p>
        <p>{data.samples} timed runs followed {data.warmups} warmups for each program. Execution order was interleaved and randomized. Elapsed time includes startup and exit, with a warm filesystem cache. Peak resident memory comes from the operating system.</p>
        <ul className="list-inside list-disc">{Object.entries(data.engines).map(([name, item]) => <li key={name}>
          {name === "rc" ? item.version : name + " " + item.version}{item.executable_mib != null && ` · ${item.executable_mib} MiB executable`}
        </li>)}</ul>
        <p>The programs exercise startup, TypeScript module loading and integer arithmetic. Package installation and sustained HTTP throughput need their own workloads.</p>
        <div className="flex flex-wrap gap-5 font-semibold underline"><a href="/benchmarks.json">Raw results</a><a href={site.social.github + "/tree/main/benchmarks"}>Harness and reproduction instructions</a></div>
      </section>
    </article>
  );
}

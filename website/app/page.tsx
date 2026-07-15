import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { CliShowcase } from "@/components/cli-showcase";
import { BenchmarkChart } from "@/components/benchmark-chart";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <CliShowcase />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold">Benchmarks</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink-700 dark:text-white/70">
          Compare against other runtimes. Charts show clearly-labeled example data until real
          measurements are published.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <BenchmarkChart />
          <Card>
            <h3 className="text-lg font-semibold">Run it yourself</h3>
            <p className="mt-2 text-sm text-ink-700 dark:text-white/70">
              Every claim is reproducible. Clone the repo and run the benchmark suite on your
              hardware.
            </p>
            <div className="mt-4">
              <CodeBlock code={"cd benchmarks\nrahulchaube run suite.bench.ts"} lang="sh" />
            </div>
            <Link href="/benchmarks" className="mt-2 inline-block text-sm font-semibold text-brand">
              View benchmarks →
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Why RahulChaube Runtime?</h2>
        <div className="mt-10 grid gap-5 text-left sm:grid-cols-3">
          {[
            { t: "Independent", d: "An MIT-licensed fork with its own identity and roadmap." },
            { t: "Compatible", d: "Runs existing Node.js and Bun code with no changes." },
            { t: "Premium DX", d: "A colorful, modern CLI designed for developer happiness." },
          ].map((x) => (
            <Card key={x.t}>
              <h3 className="text-lg font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-ink-700 dark:text-white/70">{x.d}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { TerminalDemo } from "./terminal-demo";

export function Hero() {
  return (
    <section className="border-b border-zinc-200 dark:border-vscode-border">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <h1 className="font-hero text-5xl font-bold tracking-tight sm:text-6xl">
            RC <span className="block text-emerald-700 dark:text-brand-lime">Runtime</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            Run JavaScript and TypeScript, test a module, or start an HTTP server with RC Web. One standalone executable, built by Rahul Chaube and released under MIT.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 font-semibold">
            <Link href="/download" className="inline-flex items-center gap-2 rounded-lg bg-brand-lime px-5 py-3 text-ink-900 hover:brightness-95">
              <Terminal size={18} /> Install the CLI
            </Link>
            <Link href="/docs/getting-started" className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-3 dark:border-vscode-border">
              Quick start <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <TerminalDemo />
      </div>
    </section>
  );
}

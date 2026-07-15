import { Zap, Package, Terminal, ShieldCheck, Boxes, Gauge } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  { icon: Zap, title: "Blazing fast runtime", desc: "A drop-in Node.js replacement that starts in milliseconds." },
  { icon: Terminal, title: "Premium CLI", desc: "Colorful output, spinners, progress bars, tables, and better errors." },
  { icon: Package, title: "Modern package manager", desc: "Concurrent installs, content-addressable cache, workspaces." },
  { icon: Gauge, title: "Fast bundler", desc: "Tree-shaking, minification, and source maps out of the box." },
  { icon: ShieldCheck, title: "Security tooling", desc: "Audits, license checks, and integrity verification." },
  { icon: Boxes, title: "Plugin system", desc: "Extend the CLI with third-party rahulchaube-plugin-* packages." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-bold">Everything in one tool</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-ink-700 dark:text-white/70">
        RahulChaube Runtime unifies the runtime, package manager, bundler, and test runner.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="transition-transform hover:-translate-y-1">
            <f.icon className="text-brand" size={28} />
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-700 dark:text-white/70">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

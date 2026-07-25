import { Zap, Package, Terminal, ShieldCheck, Boxes, Gauge } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  { icon: Zap, title: "Blazing Fast Runtime", desc: "A drop-in Node.js replacement that executes TypeScript and JSX with sub-20ms cold startup." },
  { icon: Terminal, title: "Premium CLI Tooling", desc: "Dependency-free CLI dispatcher with scannable progress bars, tables, and AI-assisted diagnostics." },
  { icon: Package, title: "Modern Package Manager", desc: "Concurrent installs, content-addressable global cache, and lockfile resolution." },
  { icon: Gauge, title: "Fast Bundler & Transpiler", desc: "Tree-shaking, minification, and source map generation built directly into the core engine." },
  { icon: ShieldCheck, title: "Security & Auditing", desc: "Built-in vulnerability scanning, dependency license summaries, and checksum verification." },
  { icon: Boxes, title: "Plugin Ecosystem", desc: "Extend CLI capabilities using third-party rahulchaube-plugin-* packages." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 font-sans border-t border-zinc-200 dark:border-[#30363D] transition-colors duration-200">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F0F6FC]">Everything in One Toolkit</h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-[#8B949E]">
          RahulChaube Runtime unifies the runtime engine, package manager, bundler, and test runner into a single executable.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="hover:border-blue-500/50 transition-all group">
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-[#161B22] border border-zinc-200 dark:border-[#30363D] w-fit mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-[#F0F6FC]">{f.title}</h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-[#8B949E] leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

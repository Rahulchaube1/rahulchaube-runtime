import { Card } from "./ui/card";

const examples = [
  { cmd: "rahulchaube install", out: "✔ 1,204 packages installed in 0.9s" },
  { cmd: "rahulchaube add react", out: "✔ Added react@18.3.1" },
  { cmd: "rahulchaube run dev", out: "◆ Hot reload server on http://localhost:3000" },
  { cmd: "rahulchaube doctor", out: "✔ Environment is healthy" },
  { cmd: "rahulchaube outdated", out: "3 packages have updates available" },
];

export function CliShowcase() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <h2 className="text-center text-3xl font-bold">A CLI you'll enjoy using</h2>
      <div className="mt-10 space-y-3">
        {examples.map((e) => (
          <Card key={e.cmd} className="flex flex-col gap-1 font-mono text-sm sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 rounded-lg bg-brand/10 px-3 py-1 font-semibold text-brand">{e.cmd}</span>
            <span className="text-ink-700 dark:text-white/70">{e.out}</span>
          </Card>
        ))}
      </div>
    </section>
  );
}

import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { downloadTargets } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download",
  description: "Download RahulChaube Runtime for your platform.",
};

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Download RahulChaube Runtime</h1>
      <p className="mt-3 text-ink-700 dark:text-white/70">
        Automatically detect your OS and CPU, or pick a build below.
      </p>

      <div className="mt-6">
        <CodeBlock code={"curl -fsSL https://rahulchaube.space/install | bash"} lang="sh" />
        <p className="mt-2 text-sm text-ink-700 dark:text-white/70">Windows (PowerShell):</p>
        <CodeBlock code={'powershell -c "irm https://rahulchaube.space/install.ps1 | iex"'} lang="sh" />
      </div>

      <h2 className="mt-12 text-xl font-semibold">Builds</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {downloadTargets.map((t) => (
          <Card key={`${t.os}-${t.arch}`}>
            <div className="text-2xl">{t.emoji}</div>
            <h3 className="mt-2 font-semibold">{t.label}</h3>
            <p className="text-sm text-ink-700 dark:text-white/70">
              {t.os} / {t.arch}
            </p>
            <a
              href={`https://github.com/rahulchaube/rahulchaube-runtime/releases/latest/download/rahulchaube-${t.os}-${t.arch}.tar.gz`}
              className="mt-3 inline-block text-sm font-semibold text-brand"
            >
              Download →
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}

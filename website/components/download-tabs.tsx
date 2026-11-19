"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";

const platforms = [
  { label: "macOS / Linux", shell: "Bash", cmd: "curl -fsSL https://www.rahulchaube.space/install | bash" },
  { label: "Windows x64", shell: "PowerShell", cmd: "irm https://www.rahulchaube.space/install.ps1 | iex" },
];

export function DownloadTabs() {
  const [index, setIndex] = useState(0);
  const platform = platforms[index];
  return (
    <section aria-label="Install the CLI" className="mx-auto max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 dark:border-vscode-border dark:bg-ink-800">
      <p className="mb-5 text-sm leading-relaxed">Install <a className="underline" href="https://bun.sh/">Bun</a> and sign in to the GitHub CLI with an account that can read the runtime repository.</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Operating system">
        {platforms.map(({ label }, i) => (
          <button key={label} aria-pressed={i === index} onClick={() => setIndex(i)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold aria-pressed:bg-brand-lime aria-pressed:text-ink-900 dark:border-vscode-border">{label}</button>
        ))}
      </div>
      <CodeBlock key={platform.label} code={platform.cmd} lang={platform.shell} />
      <p className="text-sm">After installation, open a new terminal and run <code>rahulchaube --version</code>.</p>
    </section>
  );
}

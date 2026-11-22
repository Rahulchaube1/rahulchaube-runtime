"use client";
import { useState } from "react";
import { CodeBlock } from "./code-block";
const platforms = [
  { label: "macOS / Linux", shell: "Bash", cmd: "curl -fsSL https://www.rahulchaube.space/install | bash" },
  { label: "Windows x64", shell: "PowerShell", cmd: "irm https://www.rahulchaube.space/install.ps1 | iex" },
];
export function DownloadTabs() {
  const [index, setIndex] = useState(0);
  const current = platforms[index];
  return (
    <section className="install-panel" aria-label="Install the CLI">
      <h2>Install from your terminal</h2>
      <fieldset className="platform-switch" aria-label="Operating system">
        {platforms.map((platform, i) => (
          <button type="button" key={platform.label} aria-pressed={i === index} onClick={() => setIndex(i)}>
            {platform.label}
          </button>
        ))}
      </fieldset>
      <CodeBlock key={current.shell} code={current.cmd} lang={current.shell} />
      <p>
        Open a new terminal and run <code className="inline-code">rc --version</code> to verify your
        installation.
      </p>
    </section>
  );
}

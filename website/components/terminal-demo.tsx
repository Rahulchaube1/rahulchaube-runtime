"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import { CodeBlock } from "./code-block";

const examples = [
  { label: "Run", instruction: "Save the first line as hello.ts, then run it from your terminal.", file: 'console.log("Hello, runtime!");', command: "rc run hello.ts", output: "Hello, runtime!" },
  { label: "Create", instruction: "Create an RC Web application with a passing route test.", command: "rc init hello" },
  { label: "Diagnose", instruction: "Check your engine, project files, and installation.", command: "rc doctor" },
];

export function TerminalDemo() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  return (
    <div className="min-w-0 rounded-2xl border border-vscode-border bg-ink-800 p-5 text-vscode-text shadow-xl sm:p-7">
      <div className="mb-5 flex items-center gap-2 border-b border-vscode-border pb-4 font-mono text-sm"><Terminal size={17} className="text-brand-lime" /> CLI examples</div>
      <fieldset className="flex gap-2" aria-label="Command examples">
        {examples.map(({ label }, index) => (
          <button key={label} aria-pressed={selected === index} onClick={() => setSelected(index)}
            className="rounded-md border border-vscode-border px-3 py-1.5 text-sm aria-pressed:bg-brand-lime aria-pressed:text-ink-900">{label}</button>
        ))}
      </fieldset>
      <p className="mt-5 text-sm leading-relaxed text-zinc-300">{example.instruction}</p>
      {example.file && <CodeBlock code={example.file} lang="hello.ts" />}
      <CodeBlock key={example.command} code={example.command} lang="Terminal" />
      {example.output && <p className="font-mono text-sm text-brand-lime"><span className="sr-only">Output </span>{example.output}</p>}
    </div>
  );
}

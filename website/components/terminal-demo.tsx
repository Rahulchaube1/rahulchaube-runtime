"use client";
import { useState } from "react";
import { Terminal } from "lucide-react";
import { CopyButton } from "./code-block";

const examples = [
  {
    label: "Create",
    title: "Create a project",
    cmd: "rc init hello",
    output: ["Created hello", '  cd "hello"', "  rc test", "  rc run server.ts"],
  },
  {
    label: "Test",
    title: "Run the starter tests inside hello",
    cmd: "rc test",
    output: ["app.test.ts", "  pass greets a visitor by name"],
  },
  {
    label: "Serve",
    title: "Start the server inside hello",
    cmd: "rc run server.ts",
    output: ["Listening on http://127.0.0.1:3000"],
  },
];
export function TerminalDemo() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  return (
    <div className="terminal-demo">
      <div className="terminal-title">
        <span>
          <Terminal size={15} /> rc <i>/</i> terminal
        </span>
        <div className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <fieldset className="terminal-tabs" aria-label="Command examples">
        {examples.map((item, i) => (
          <button type="button" key={item.label} onClick={() => setSelected(i)} aria-pressed={selected === i}>
            {item.label}
          </button>
        ))}
      </fieldset>
      <div className="terminal-content">
        <p># {example.title}</p>
        <div className="terminal-line">
          <span>$</span> <code>{example.cmd}</code>
          <CopyButton text={example.cmd} label="Copy terminal command" />
        </div>
        <pre>{example.output.join("\n")}</pre>
      </div>
    </div>
  );
}

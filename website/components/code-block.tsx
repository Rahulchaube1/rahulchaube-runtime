"use client";
import { useState, type ReactNode } from "react";
import { Check, Copy, Terminal } from "lucide-react";

export function CopyButton({
  text,
  label = "Copy code",
}: {
  readonly text: string;
  readonly label?: string;
}) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Select the text to copy");
    }
    setTimeout(() => setStatus(""), 1800);
  }
  return (
    <button type="button" className="copy-button" aria-label={label} onClick={copy}>
      {status === "Copied" ? <Check size={15} /> : <Copy size={15} />}
      <span className={status ? "" : "sr-only"} aria-live="polite">
        {status || label}
      </span>
    </button>
  );
}

export function CodeBlock({
  code,
  lang,
  children,
}: {
  readonly code: string;
  readonly lang?: string;
  readonly children?: ReactNode;
}) {
  return (
    <div className="code-block">
      <div className="code-top">
        <span>
          <Terminal size={14} />
          {lang || "Code"}
        </span>
        <CopyButton text={code} />
      </div>
      <pre tabIndex={0}>
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}

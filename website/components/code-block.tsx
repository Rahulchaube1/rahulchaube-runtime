"use client";

import { useState } from "react";

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [status, setStatus] = useState("Copy");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied!");
    } catch {
      setStatus("Select text to copy");
    }
    setTimeout(() => setStatus("Copy"), 1800);
  }

  return (
    <div className="group relative my-4 rounded-xl bg-ink-900 text-white">
      {lang && <span className="absolute left-3 top-2 text-xs text-white/40">{lang}</span>}
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded-md border border-white/10 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
      >
        <span aria-live="polite">{status}</span>
      </button>
      <pre className="overflow-x-auto p-4 pt-8 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

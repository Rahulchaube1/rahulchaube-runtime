import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Fragment, isValidElement } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { createLowlight } from "lowlight";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell";
import json from "highlight.js/lib/languages/json";
import { CodeBlock } from "./code-block";
import { headingId } from "@/lib/docs";

const highlighter = createLowlight({ typescript, javascript, bash, powershell, json });
const languageNames: Record<string, string> = {
  ts: "TypeScript",
  js: "JavaScript",
  sh: "Shell",
  powershell: "PowerShell",
  json: "JSON",
};

export function highlightCode(code: string, language?: string) {
  if (!language || !highlighter.registered(language)) return code;
  return toJsxRuntime(highlighter.highlight(language, code), { Fragment, jsx, jsxs });
}

const components: Components = {
  h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
  table: ({ children }) => (
    <div className="table-scroll">
      <table>{children}</table>
    </div>
  ),
  pre: ({ children }) => {
    if (!isValidElement<{ children: string; className?: string }>(children)) return <pre>{children}</pre>;
    const language = children.props.className?.replace(/^language-/, "");
    const code = String(children.props.children).replace(/\n$/, "");
    return (
      <CodeBlock code={code} lang={language && (languageNames[language] || language)}>
        {highlightCode(code, language)}
      </CodeBlock>
    );
  },
};

export function Markdown({ source }: { readonly source: string }) {
  return (
    <div className="prose-rc">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}

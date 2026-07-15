import { Fragment, type ReactNode } from "react";

/**
 * Minimal, dependency-free Markdown renderer for docs/blog content.
 * Supports: headings, paragraphs, fenced code, inline code, bold, lists.
 */
export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push(
        <pre key={key++} className="my-4 overflow-x-auto rounded-xl bg-ink-900 p-4 text-sm text-white">
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(<h3 key={key++} className="mt-6 text-lg font-semibold">{line.slice(4)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(<h2 key={key++} className="mt-8 text-2xl font-bold">{line.slice(3)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(<h1 key={key++} className="text-3xl font-extrabold">{line.slice(2)}</h1>);
      i++;
      continue;
    }

    if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-3 list-disc space-y-1 pl-6">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} className="my-3 leading-relaxed text-ink-700 dark:text-white/80">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return <div>{blocks}</div>;
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/`([^`]+)`|\*\*([^*]+)\*\*/g);
  return (
    <Fragment>
      {parts.map((part, idx) => {
        if (part === undefined) return null;
        if (idx % 3 === 1) return <code key={idx} className="rounded bg-black/10 px-1 dark:bg-white/10">{part}</code>;
        if (idx % 3 === 2) return <strong key={idx}>{part}</strong>;
        return <Fragment key={idx}>{part}</Fragment>;
      })}
    </Fragment>
  );
}

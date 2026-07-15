/**
 * Beautiful, box-drawn tables with alignment, colors, and optional headers.
 */

import { colors } from "./colors.ts";

export interface Column {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  color?: (s: string) => string;
  width?: number;
}

export function table(rows: Record<string, string>[], columns: Column[]): string {
  const widths = columns.map((c) => {
    const data = rows.map((r) => stripAnsi(String(r[c.key] ?? "")).length);
    const header = stripAnsi(c.header).length;
    return Math.max(c.width ?? 0, header, ...data) + 2;
  });

  const sep = columns
    .map((_, i) => "─".repeat(widths[i]))
    .join("┼");

  const headerLine =
    "┌" + widths.map((w) => "─".repeat(w)).join("┬") + "┐";
  const footerLine =
    "└" + widths.map((w) => "─".repeat(w)).join("┴") + "┘";

  const cell = (content: string, w: number, align: string, color?: (s: string) => string) => {
    const text = color ? color(content) : content;
    const raw = stripAnsi(content).length;
    const pad = w - raw - 1;
    let out = " " + text;
    if (align === "right") out = " ".repeat(pad) + text;
    else if (align === "center") out = " ".repeat(Math.floor(pad / 2)) + text + " ".repeat(Math.ceil(pad / 2));
    else out = text + " ".repeat(pad);
    return out + " ";
  };

  const header =
    "│" +
    columns.map((c, i) => cell(colors.bold(colors.cyan(c.header)), widths[i], c.align ?? "left")) +
    "│";

  const body = rows.map(
    (r) =>
      "│" +
      columns.map((c, i) => cell(String(r[c.key] ?? ""), widths[i], c.align ?? "left", c.color)) +
      "│",
  );

  return [headerLine, header, "├" + sep + "┤", ...body, footerLine].join("\n");
}

export function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

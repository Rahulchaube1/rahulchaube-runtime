/**
 * Interactive prompts: text, confirm, and single-select lists.
 * Uses raw TTY mode when available; falls back to plain line input.
 */

import { colors } from "./colors.ts";
import { icons } from "./icons.ts";

const decoder = new TextDecoder();

export async function text(question: string, opts: { placeholder?: string; default?: string } = {}): Promise<string> {
  process.stdout.write(`${colors.magenta(icons.question)} ${colors.bold(question)} ${colors.dim(opts.placeholder ? `(${opts.placeholder}) ` : "")}`);
  const line = await readLine();
  const v = line.trim();
  return v || opts.default || "";
}

export async function confirm(question: string, def = true): Promise<boolean> {
  const hint = def ? `${colors.green("Y")}/${colors.dim("n")}` : `${colors.dim("y")}/${colors.green("N")}`;
  process.stdout.write(`${colors.magenta(icons.question)} ${colors.bold(question)} ${colors.dim(hint + " ")}`);
  const line = (await readLine()).trim().toLowerCase();
  if (line === "") return def;
  return line === "y" || line === "yes";
}

export async function select<T extends string>(question: string, choices: ReadonlyArray<{ value: T; label: string; hint?: string }>): Promise<T> {
  process.stdout.write(`${colors.magenta(icons.question)} ${colors.bold(question)}\n`);
  choices.forEach((c, i) => {
    process.stdout.write(
      `  ${colors.gray((i + 1) + ".")} ${c.label}${c.hint ? " " + colors.dim(c.hint) : ""}\n`,
    );
  });
  process.stdout.write(colors.dim("  choose [1-" + choices.length + "]: "));
  const line = (await readLine()).trim();
  const idx = parseInt(line, 10);
  if (Number.isFinite(idx) && idx >= 1 && idx <= choices.length) return choices[idx - 1].value;
  return choices[0].value;
}

async function readLine(): Promise<string> {
  if (!process.stdin.isTTY) {
    const buf: number[] = [];
    for await (const chunk of process.stdin) {
      buf.push(...chunk);
      if (chunk.includes("\n")) break;
    }
    return decoder.decode(new Uint8Array(buf));
  }
  const { stdin } = process;
  stdin.setRawMode?.(false);
  const data = await new Promise<string>((resolve) => {
    stdin.resume();
    stdin.once("data", (d) => {
      const s = typeof d === "string" ? d : decoder.decode(d);
      resolve(s);
    });
  });
  return data;
}

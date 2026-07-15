/**
 * `rahulchaube explain <thing>` — explain an error log, config, or concept.
 *
 * Provides human-readable explanations for common runtime/package-manager
 * diagnostics found in a log file or inline string.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { existsSync, readFileSync } from "node:fs";

const KNOWNS: { pattern: RegExp; title: string; explain: string }[] = [
  {
    pattern: /EACCES|permission denied/i,
    title: "Permission denied",
    explain:
      "The runtime could not access a file or directory. Check ownership and that the path exists. " +
      "Avoid running as root; fix permissions with `chown`/`chmod` instead.",
  },
  {
    pattern: /Cannot find module ['"]([^'"]+)['"]/i,
    title: "Missing module",
    explain:
      "A required dependency is not installed or not resolvable. Run `rahulchaube install` and verify " +
      "the import path and your lockfile. Use `rahulchaube why <pkg>` to trace it.",
  },
  {
    pattern: /Cannot find name ['"]([^'"]+)['"]/i,
    title: "Unknown identifier (TypeScript)",
    explain:
      "A symbol is used before it is declared or typed. Add the missing import or install the package's " +
      "type definitions (`rahulchaube add -d @types/...`).",
  },
  {
    pattern: /SyntaxError|Unexpected token/i,
    title: "Syntax error",
    explain:
      "The parser hit an unexpected token. This is usually a typo, a missing bracket, or mixing ESM/CJS. " +
      "Run `rahulchaube build` to get a precise location.",
  },
  {
    pattern: /out of memory|heap/i,
    title: "Out of memory",
    explain:
      "The process exceeded available memory. Reduce batch sizes, stream large inputs, or raise the limit " +
      "with `RAHULCHAUBE_MAX_HEAP` / `NODE_OPTIONS=--max-old-space-size=`.",
  },
  {
    pattern: /ECONNREFUSED|network|fetch failed/i,
    title: "Network failure",
    explain:
      "A connection was refused or a fetch failed. Verify connectivity, proxy settings, and the registry URL " +
      "in your config (`rahulchaube doctor`).",
  },
];

export async function explain(args: string[], _flags: Record<string, unknown>): Promise<number> {
  const target = args[0];
  if (!target) {
    log.error("Usage: rahulchaube explain <log-file | error-text | concept>");
    return 1;
  }

  let text = target;
  if (existsSync(target)) {
    try {
      text = readFileSync(target, "utf8");
    } catch {
      text = target;
    }
  }

  const matched = KNOWNS.filter((k) => k.pattern.test(text));
  if (matched.length === 0) {
    log.info(`${icons.search} No known diagnostic pattern matched ${colors.dim(target)}.`);
    log.plain(""); log.plain(colors.dim("Tips:"));
    log.plain("  • Paste the full error output for better matches.");
    log.plain("  • Run `rahulchaube doctor` to check your environment.");
    log.plain("  • Run `rahulchaube analyze` for project-wide diagnostics.");
    return 0;
  }

  for (const m of matched) {
    log.plain("");
    log.plain(`${colors.magenta(icons.search)} ${colors.bold(m.title)}`);
    log.plain(`  ${m.explain}`);
  }
  log.plain("");
  return 0;
}

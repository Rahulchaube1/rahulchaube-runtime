/**
 * RahulChaube Runtime CLI — command dispatcher.
 */
import { colors, brand } from "./ui/colors.ts";
import { icons } from "./ui/icons.ts";
import { banner } from "./ui/banner.ts";
import { log, setLevel } from "./ui/logger.ts";

import { install } from "./commands/install.ts";
import { add } from "./commands/add.ts";
import { remove } from "./commands/remove.ts";
import { update } from "./commands/update.ts";
import { run } from "./commands/run.ts";
import { test } from "./commands/test.ts";
import { build } from "./commands/build.ts";
import { create } from "./commands/create.ts";
import { doctor } from "./commands/doctor.ts";
import { audit } from "./commands/audit.ts";
import { licenses } from "./commands/licenses.ts";
import { graph } from "./commands/graph.ts";
import { why } from "./commands/why.ts";
import { outdated } from "./commands/outdated.ts";
import { cache } from "./commands/cache.ts";
import { benchmark } from "./commands/benchmark.ts";
import { explain } from "./commands/explain.ts";
import { optimize } from "./commands/optimize.ts";
import { migrate } from "./commands/migrate.ts";
import { analyze } from "./commands/analyze.ts";
import { plugins } from "./commands/plugins.ts";

import { profileCommand } from "./commands/profile.ts";
import { compatibilityCommand } from "./commands/compatibility.ts";
import { upgradeCommand } from "./commands/upgrade.ts";
import { uninstallCommand } from "./commands/uninstall.ts";

const VERSION = "1.0.0";

type CommandFn = (args: string[], flags: Record<string, unknown>) => Promise<number>;

const COMMANDS: Record<string, { fn: CommandFn; summary: string; group: string }> = {
  install: { fn: install, summary: "Install dependencies", group: "Package Manager" },
  add: { fn: add, summary: "Add a dependency", group: "Package Manager" },
  remove: { fn: remove, summary: "Remove a dependency", group: "Package Manager" },
  update: { fn: update, summary: "Update dependencies", group: "Package Manager" },
  run: { fn: run, summary: "Run a script", group: "Execute" },
  test: { fn: test, summary: "Run the test suite", group: "Execute" },
  build: { fn: build, summary: "Bundle your project", group: "Execute" },
  profile: { fn: profileCommand, summary: "Profile script execution", group: "Execute" },
  compatibility: { fn: compatibilityCommand, summary: "Run compatibility test matrix", group: "Execute" },
  create: { fn: create, summary: "Scaffold a new project", group: "Project" },
  doctor: { fn: doctor, summary: "Diagnose & repair environment", group: "Maintenance" },
  audit: { fn: audit, summary: "Scan for vulnerabilities", group: "Maintenance" },
  licenses: { fn: licenses, summary: "Summarize dependency licenses", group: "Maintenance" },
  graph: { fn: graph, summary: "Show the dependency graph", group: "Maintenance" },
  why: { fn: why, summary: "Why is a dependency installed?", group: "Maintenance" },
  outdated: { fn: outdated, summary: "List outdated dependencies", group: "Maintenance" },
  "cache": { fn: cache, summary: "Clean package caches", group: "Maintenance" },
  upgrade: { fn: upgradeCommand, summary: "Self-update to latest release", group: "Maintenance" },
  uninstall: { fn: uninstallCommand, summary: "Uninstall RahulChaube Runtime", group: "Maintenance" },
  benchmark: { fn: benchmark, summary: "Run performance benchmarks", group: "Performance" },
  explain: { fn: explain, summary: "Explain an error or concept", group: "AI Tools" },
  optimize: { fn: optimize, summary: "Suggest performance fixes", group: "AI Tools" },
  migrate: { fn: migrate, summary: "Migrate from another tool", group: "AI Tools" },
  analyze: { fn: analyze, summary: "Analyze project health", group: "AI Tools" },
  plugins: { fn: plugins, summary: "Manage plugins", group: "Ecosystem" },
};

function showHelp() {
  log.plain(banner(VERSION));
  log.plain(`${colors.bold("USAGE")}`);
  log.plain(`  ${colors.cyan("rahulchaube")} ${colors.dim("<command> [args] [options]")}`);
  log.plain("");
  const groups = new Map<string, { name: string; summary: string }[]>();
  for (const [name, meta] of Object.entries(COMMANDS)) {
    if (!groups.has(meta.group)) groups.set(meta.group, []);
    groups.get(meta.group)!.push({ name, summary: meta.summary });
  }
  for (const [group, cmds] of groups) {
    log.plain(colors.bold(colors.magenta(group)));
    for (const c of cmds) {
      log.plain(`  ${colors.cyan(c.name.padEnd(12))} ${colors.dim(c.summary)}`);
    }
    log.plain("");
  }
  log.plain(colors.bold("OPTIONS"));
  log.plain(`  ${colors.cyan("--help, -h")}     ${colors.dim("Show help")}`);
  log.plain(`  ${colors.cyan("--version, -v")}  ${colors.dim("Show version")}`);
  log.plain(`  ${colors.cyan("--json")}        ${colors.dim("Emit JSON output")}`);
  log.plain(`  ${colors.cyan("--no-color")}    ${colors.dim("Disable colors")}`);
  log.plain("");
  log.plain(colors.dim("RahulChaube Runtime — High-performance developer platform."));
}

function parseFlags(argv: string[]): { args: string[]; flags: Record<string, unknown> } {
  const args: string[] = [];
  const flags: Record<string, unknown> = {};
  for (const a of argv) {
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      flags[k] = v ?? true;
    } else if (a.startsWith("-") && a.length > 1) {
      flags[a.slice(1)] = true;
    } else {
      args.push(a);
    }
  }
  if (flags["no-color"]) process.env.NO_COLOR = "1";
  if (flags.debug) setLevel("debug");
  return { args, flags };
}

export async function main(argv: string[]): Promise<number> {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    showHelp();
    return 0;
  }
  if (argv[0] === "--version" || argv[0] === "-v") {
    log.plain(`${brand(icons.logo + " rahulchaube")} ${colors.dim("v" + VERSION)}`);
    return 0;
  }

  const { args, flags } = parseFlags(argv.slice(1));
  const cmd = argv[0];
  const meta = COMMANDS[cmd];
  if (!meta) {
    log.error(`Unknown command ${colors.bold(cmd)}.`);
    log.info(`Run ${colors.bold("rahulchaube --help")} for the full command list.`);
    return 1;
  }
  if (flags.help) {
    showHelp();
    return 0;
  }
  try {
    return await meta.fn(args, flags);
  } catch (err) {
    log.error(`Command ${colors.bold(cmd)} failed: ${(err as Error).message}`);
    if (flags.debug) log.raw((err as Error).stack ?? "");
    return 1;
  }
}

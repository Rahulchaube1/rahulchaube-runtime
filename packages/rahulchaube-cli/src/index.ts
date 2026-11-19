/**
 * RahulChaube Runtime CLI — command dispatcher.
 */
import { colors, brand } from "./ui/colors.ts";
import { icons } from "./ui/icons.ts";
import { banner } from "./ui/banner.ts";
import { log, setLevel } from "./ui/logger.ts";

import cliPackage from "../package.json";
const VERSION = cliPackage.version;

type CommandFn = (args: string[], flags: Record<string, unknown>) => Promise<number>;

const COMMANDS: Record<string, { fn: CommandFn; summary: string; group: string }> = {
  install: { fn: async (args, flags) => (await import("./commands/install.ts")).install(args, flags), summary: "Install dependencies", group: "Package Manager" },
  add: { fn: async (args, flags) => (await import("./commands/add.ts")).add(args, flags), summary: "Add a dependency", group: "Package Manager" },
  remove: { fn: async (args, flags) => (await import("./commands/remove.ts")).remove(args, flags), summary: "Remove a dependency", group: "Package Manager" },
  update: { fn: async (args, flags) => (await import("./commands/update.ts")).update(args, flags), summary: "Update dependencies", group: "Package Manager" },
  run: { fn: async (args, flags) => (await import("./commands/run.ts")).run(args, flags), summary: "Run a script", group: "Execute" },
  test: { fn: async (args, flags) => (await import("./commands/test.ts")).test(args, flags), summary: "Run the test suite", group: "Execute" },
  build: { fn: async (args, flags) => (await import("./commands/build.ts")).build(args, flags), summary: "Bundle your project", group: "Execute" },
  blyx: { fn: async (args) => (await import("./commands/blyx.ts")).blyx(args), summary: "Run the Blyx compiler or interpreter", group: "Execute" },
  profile: { fn: async (args, flags) => (await import("./commands/profile.ts")).profileCommand(args, flags), summary: "Profile script execution", group: "Execute" },
  compatibility: { fn: async (args, flags) => (await import("./commands/compatibility.ts")).compatibilityCommand(args, flags), summary: "Run compatibility test matrix", group: "Execute" },
  create: { fn: async (args, flags) => (await import("./commands/create.ts")).create(args, flags), summary: "Scaffold a new project", group: "Project" },
  doctor: { fn: async (args, flags) => (await import("./commands/doctor.ts")).doctor(args, flags), summary: "Diagnose & repair environment", group: "Maintenance" },
  audit: { fn: async (args, flags) => (await import("./commands/audit.ts")).audit(args, flags), summary: "Scan for vulnerabilities", group: "Maintenance" },
  licenses: { fn: async (args, flags) => (await import("./commands/licenses.ts")).licenses(args, flags), summary: "Summarize dependency licenses", group: "Maintenance" },
  graph: { fn: async (args, flags) => (await import("./commands/graph.ts")).graph(args, flags), summary: "Show the dependency graph", group: "Maintenance" },
  why: { fn: async (args, flags) => (await import("./commands/why.ts")).why(args, flags), summary: "Why is a dependency installed?", group: "Maintenance" },
  outdated: { fn: async (args, flags) => (await import("./commands/outdated.ts")).outdated(args, flags), summary: "List outdated dependencies", group: "Maintenance" },
  "cache": { fn: async (args, flags) => (await import("./commands/cache.ts")).cache(args, flags), summary: "Clean package caches", group: "Maintenance" },
  upgrade: { fn: async () => (await import("./commands/upgrade.ts")).upgradeCommand(), summary: "Self-update to latest release", group: "Maintenance" },
  uninstall: { fn: async (args, flags) => (await import("./commands/uninstall.ts")).uninstallCommand(args, flags), summary: "Uninstall RahulChaube Runtime", group: "Maintenance" },
  benchmark: { fn: async (args, flags) => (await import("./commands/benchmark.ts")).benchmark(args, flags), summary: "Run performance benchmarks", group: "Performance" },
  explain: { fn: async (args, flags) => (await import("./commands/explain.ts")).explain(args, flags), summary: "Explain an error or concept", group: "AI Tools" },
  optimize: { fn: async (args, flags) => (await import("./commands/optimize.ts")).optimize(args, flags), summary: "Suggest performance fixes", group: "AI Tools" },
  migrate: { fn: async (args, flags) => (await import("./commands/migrate.ts")).migrate(args, flags), summary: "Migrate from another tool", group: "AI Tools" },
  analyze: { fn: async (args, flags) => (await import("./commands/analyze.ts")).analyze(args, flags), summary: "Analyze project health", group: "AI Tools" },
  plugins: { fn: async (args, flags) => (await import("./commands/plugins.ts")).plugins(args, flags), summary: "Manage plugins", group: "Ecosystem" },
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

function readLongFlag(argv: string[], index: number, flags: Record<string, unknown>): number {
  const option = argv[index].slice(2);
  const equals = option.indexOf("=");
  if (equals >= 0) {
    flags[option.slice(0, equals)] = option.slice(equals + 1);
    return index;
  }
  if (!["outdir", "target", "outfile"].includes(option)) {
    flags[option] = true;
    return index;
  }
  const value = argv[index + 1];
  if (!value || value.startsWith("-")) throw new Error(`--${option} requires a value`);
  flags[option] = value;
  return index + 1;
}

function parseFlags(argv: string[]): { args: string[]; flags: Record<string, unknown> } {
  const args: string[] = [];
  const flags: Record<string, unknown> = Object.create(null);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") {
      args.push(...argv.slice(i + 1));
      break;
    }
    if (a.startsWith("--")) {
      i = readLongFlag(argv, i, flags);
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

  const cmd = argv[0];
  const meta = COMMANDS[cmd];
  if (!Object.hasOwn(COMMANDS, cmd)) {
    log.error(`Unknown command ${colors.bold(cmd)}.`);
    log.info(`Run ${colors.bold("rahulchaube --help")} for the full command list.`);
    return 1;
  }
  try {
    if (cmd === "blyx") return await meta.fn(argv.slice(1), {});
    const { args, flags } = parseFlags(argv.slice(1));
    if (flags.help || flags.h) {
      showHelp();
      return 0;
    }
    return await meta.fn(args, flags);
  } catch (err) {
    log.error(`Command ${colors.bold(cmd)} failed: ${(err as Error).message}`);
    if (argv.includes("--debug")) log.raw((err as Error).stack ?? "");
    return 1;
  }
}

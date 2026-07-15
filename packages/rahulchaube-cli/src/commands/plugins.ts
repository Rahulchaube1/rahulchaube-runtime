/**
 * `rahulchaube plugins [install|list|update|remove] [name]` — stable plugin API.
 *
 * Plugins are per-user extensions resolved from the npm registry and stored in
 * a managed plugins directory. Third parties publish packages named
 * `rahulchaube-plugin-*`.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { table } from "../ui/table.ts";
import { runEngine } from "../engine/bun.ts";
import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const PLUGINS_HOME = join(homedir(), ".rahulchaube", "plugins");

export async function plugins(args: string[], _flags: Record<string, unknown>): Promise<number> {
  const action = args[0] ?? "list";
  const name = args[1];

  if (action === "install") {
    if (!name) {
      log.error("Usage: rahulchaube plugins install <name>");
      return 1;
    }
    const pkg = name.startsWith("rahulchaube-plugin-") ? name : `rahulchaube-plugin-${name}`;
    log.info(`${icons.plug} Installing plugin ${colors.bold(pkg)}…`);
    const r = runEngine(["add", "--global", pkg], { inherit: false });
    if (r.code !== 0) {
      // Fallback: install into the managed plugins dir.
      mkdirSync(PLUGINS_HOME, { recursive: true });
      const rr = runEngine(["install", pkg], { inherit: false, cwd: PLUGINS_HOME });
      if (rr.code !== 0) {
        log.error(`Failed to install ${pkg}.`);
        return 1;
      }
    }
    writeManifest(pkg);
    log.success(`${icons.success} Plugin ${colors.bold(pkg)} installed.`);
    return 0;
  }

  if (action === "update") {
    const target = name;
    log.info(`${icons.refresh} Updating ${target ? colors.bold(target) : "all plugins"}…`);
    const r = runEngine(["update", ...(target ? [target] : [])], {
      inherit: false,
      cwd: PLUGINS_HOME,
    });
    return r.code;
  }

  if (action === "remove") {
    if (!name) {
      log.error("Usage: rahulchaube plugins remove <name>");
      return 1;
    }
    const pkg = name.startsWith("rahulchaube-plugin-") ? name : `rahulchaube-plugin-${name}`;
    const r = runEngine(["remove", "--global", pkg], { inherit: false });
    removeManifest(pkg);
    log.success(`Removed ${colors.bold(pkg)}.`);
    return r.code;
  }

  // list
  const installed = listInstalled();
  if (installed.length === 0) {
    log.info(`No plugins installed. Add one with ${colors.bold("rahulchaube plugins install <name>")}.`);
    return 0;
  }
  log.plain(
    table(installed, [
      { key: "name", header: "Plugin", color: colors.bold },
      { key: "version", header: "Version", color: colors.cyan },
      { key: "status", header: "Status", color: (s) => colors.green(s) },
    ]),
  );
  return 0;
}

function manifestPath() {
  return join(PLUGINS_HOME, "plugins.json");
}

function readManifest(): string[] {
  try {
    return JSON.parse(readFileSync(manifestPath(), "utf8")) as string[];
  } catch {
    return [];
  }
}

function writeManifest(pkg: string) {
  mkdirSync(PLUGINS_HOME, { recursive: true });
  const cur = readManifest();
  if (!cur.includes(pkg)) cur.push(pkg);
  writeFileSync(manifestPath(), JSON.stringify(cur, null, 2) + "\n");
}

function removeManifest(pkg: string) {
  const cur = readManifest().filter((p) => p !== pkg);
  writeFileSync(manifestPath(), JSON.stringify(cur, null, 2) + "\n");
}

function listInstalled(): { name: string; version: string; status: string }[] {
  const out: { name: string; version: string; status: string }[] = [];
  const dir = join(PLUGINS_HOME, "node_modules");
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (!entry.startsWith("rahulchaube-plugin-")) continue;
    const pj = join(dir, entry, "package.json");
    if (!existsSync(pj)) continue;
    try {
      const meta = JSON.parse(readFileSync(pj, "utf8"));
      out.push({ name: meta.name, version: meta.version ?? "?", status: "active" });
    } catch {
      /* ignore */
    }
  }
  return out;
}

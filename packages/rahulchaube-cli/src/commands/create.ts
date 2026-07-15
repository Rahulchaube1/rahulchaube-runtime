/**
 * `rahulchaube create [template] [name]` — interactive project generator.
 */
import { log } from "../ui/logger.ts";
import { colors } from "../ui/colors.ts";
import { icons } from "../ui/icons.ts";
import { text, select, confirm } from "../ui/prompt.ts";
import { writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { TEMPLATES, type ProjectTemplate } from "./templates.ts";
import { spinner } from "../ui/spinner.ts";

export async function create(args: string[], _flags: Record<string, unknown>): Promise<number> {
  let templateId = args[0];
  let name = args[1];

  if (!templateId) {
    const choice = await select(
      "Which template would you like to use?",
      TEMPLATES.map((t) => ({ value: t.id, label: t.label, hint: t.description })),
    );
    templateId = choice;
  }

  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];

  if (!name) {
    name = await text("Project name:", { placeholder: "my-app" });
    if (!name) name = "my-app";
  }

  const targetDir = join(process.cwd(), name);
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    const ok = await confirm(`Directory ${colors.bold(name)} already exists and is not empty. Continue?`, false);
    if (!ok) {
      log.warn("Aborted.");
      return 1;
    }
  }

  const sp = spinner(`${icons.hammer} Scaffolding ${colors.bold(name)} (${template.label})…`);
  mkdirSync(targetDir, { recursive: true });
  const ctx = { name, dir: targetDir };
  for (const f of template.files(ctx)) {
    const full = join(targetDir, f.path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, f.contents);
  }
  sp.succeed(`${colors.green(icons.success)} Created ${colors.bold(name)}`);

  log.plain("");
  log.plain(`${colors.magenta(icons.rocket)} Next steps:`);
  log.plain(`  ${colors.cyan("cd")} ${name}`);
  log.plain(`  ${colors.cyan("rahulchaube install")}`);
  log.plain(`  ${colors.cyan("rahulchaube run dev")}`);
  log.plain("");
  return 0;
}

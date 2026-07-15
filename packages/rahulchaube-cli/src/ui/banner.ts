/**
 * ASCII banner and branded header for the RahulChaube Runtime CLI.
 */

import { colors, brand } from "./colors.ts";
import { icons } from "./icons.ts";

export function banner(version: string): string {
  const line = `${brand(`${icons.logo} RahulChaube Runtime`)} ${colors.dim("v" + version)}`;
  const tag = colors.dim("A next-generation JavaScript runtime & developer platform.");
  return `\n${line}\n${tag}\n`;
}

export function welcome(name: string): string {
  return `${colors.magenta("◆")} ${colors.bold("Welcome to")} ${brand(name)} ${colors.dim(
    "— let's build something fast.",
  )}\n`;
}

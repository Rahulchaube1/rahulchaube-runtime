/**
 * Banner and branded header for the RahulChaube Runtime CLI.
 */

import { colors, brand } from "./colors.ts";

export function banner(version: string): string {
  const line = `${brand("RahulChaube Runtime")} ${colors.dim("v" + version)}`;
  const tag = colors.dim("A next-generation JavaScript runtime & developer platform.");
  return `\n${line}\n${tag}\n`;
}

export function welcome(name: string): string {
  return `${colors.bold("Welcome to")} ${brand(name)} ${colors.dim(
    "— let's build something fast.",
  )}\n`;
}

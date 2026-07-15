/**
 * Structured, color-coded logging for the RahulChaube Runtime CLI.
 */

import { colors } from "./colors.ts";
import { icons } from "./icons.ts";

export interface Logger {
  info(msg: string): void;
  success(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  debug(msg: string): void;
  plain(msg: string): void;
  raw(msg: string): void;
}

let level: "debug" | "info" | "warn" = "info";

export function setLevel(l: typeof level) {
  level = l;
}

export const log: Logger = {
  info(msg: string) {
    process.stdout.write(`${colors.cyan(icons.info)} ${msg}\n`);
  },
  success(msg: string) {
    process.stdout.write(`${colors.green(icons.success)} ${msg}\n`);
  },
  warn(msg: string) {
    process.stderr.write(`${colors.yellow(icons.warn)} ${msg}\n`);
  },
  error(msg: string) {
    process.stderr.write(`${colors.red(icons.error)} ${msg}\n`);
  },
  debug(msg: string) {
    if (level === "debug") process.stderr.write(`${colors.gray(icons.bullet)} ${colors.gray(msg)}\n`);
  },
  plain(msg: string) {
    process.stdout.write(msg + "\n");
  },
  raw(msg: string) {
    process.stdout.write(msg);
  },
};

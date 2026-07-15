/**
 * Shared helper to forward a command to the engine with branded output.
 */

import { runEngine } from "../engine/bun.ts";
import { log } from "../ui/logger.ts";
import { icons } from "../ui/icons.ts";

export function forward(command: string, args: string[], label: string) {
  log.info(`${label}…`);
  const r = runEngine([command, ...args]);
  if (r.code !== 0) {
    log.error(`${label} failed.`);
  } else {
    log.success(`${label} complete.`);
  }
  return r.code;
}

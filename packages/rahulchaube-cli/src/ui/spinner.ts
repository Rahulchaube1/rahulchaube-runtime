/**
 * Animated terminal spinner with frames and a contextual suffix.
 * Automatically disabled when stdout is not a TTY or NO_COLOR is set.
 */

import { colors } from "./colors.ts";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const SIMPLE_FRAMES = ["-", "\\", "|", "/"];

export interface Spinner {
  text(msg: string): Spinner;
  suffix(msg: string): Spinner;
  succeed(msg?: string): void;
  fail(msg?: string): void;
  stop(): void;
}

export function spinner(initial = ""): Spinner {
  const isTty = !!process.stdout.isTTY && !process.env.NO_COLOR;
  let frame = 0;
  let text = initial;
  let suffix = "";
  let timer: ReturnType<typeof setInterval> | null = null;
  let stopped = false;

  function render() {
    if (!isTty) return;
    const f = isWide() ? FRAMES[frame % FRAMES.length] : SIMPLE_FRAMES[frame % SIMPLE_FRAMES.length];
    process.stdout.write(`\r${colors.cyan(f)} ${text}${suffix ? " " + colors.dim(suffix) : ""}`);
  }

  function isWide() {
    return !process.env.LANG?.toLowerCase().includes("ascii");
  }

  if (isTty) {
    timer = setInterval(() => {
      if (stopped) return;
      process.stdout.write("\r\x1b[K");
      frame++;
      render();
    }, 80);
    render();
  } else if (initial) {
    process.stdout.write(`${text}\n`);
  }

  function clear() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (isTty && !stopped) process.stdout.write("\r\x1b[K");
  }

  return {
    text(msg: string) {
      text = msg;
      if (!isTty) process.stdout.write(`${msg}\n`);
      return this;
    },
    suffix(msg: string) {
      suffix = msg;
      return this;
    },
    succeed(msg?: string) {
      stopped = true;
      clear();
      process.stdout.write(`${colors.green("✔")} ${msg ?? text}\n`);
    },
    fail(msg?: string) {
      stopped = true;
      clear();
      process.stdout.write(`${colors.red("✖")} ${msg ?? text}\n`);
    },
    stop() {
      stopped = true;
      clear();
    },
  };
}

/**
 * Modern multi-bar progress renderer with ETA and throughput.
 * Falls back to a single line when stdout is not a TTY.
 */

import { colors } from "./colors.ts";

const WIDTH = 32;

export interface ProgressHandle {
  set(opts: { value?: number; total?: number; label?: string }): void;
  increment(n?: number): void;
  done(msg?: string): void;
}

class Progress {
  private bars: { label: string; value: number; total: number; start: number }[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private isTty = !!process.stdout.isTTY && !process.env.NO_COLOR;

  start() {
    if (!this.isTty) return;
    this.timer = setInterval(() => this.render(), 60);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.isTty) process.stdout.write("\x1b[0m");
  }

  add(label: string, total = 100): ProgressHandle {
    const bar = { label, value: 0, total, start: Date.now() };
    this.bars.push(bar);
    const self = this;
    return {
      set(o) {
        if (o.value !== undefined) bar.value = o.value;
        if (o.total !== undefined) bar.total = o.total;
        if (o.label !== undefined) bar.label = o.label;
      },
      increment(n = 1) {
        bar.value = Math.min(bar.total, bar.value + n);
      },
      done(msg?: string) {
        bar.value = bar.total;
        if (!self.isTty) process.stdout.write(`${label}: ${msg ?? "done"}\n`);
      },
    };
  }

  private render() {
    process.stdout.write("\x1b[0m\x1b[K");
    const lines = this.bars.map((b) => this.line(b));
    process.stdout.write("\x1b[2K\x1b[1A".repeat(0));
    process.stdout.write("\r\x1b[" + this.bars.length + "A");
    for (const l of lines) {
      process.stdout.write("\x1b[2K" + l + "\n");
    }
  }

  private line(b: { label: string; value: number; total: number; start: number }) {
    const pct = b.total > 0 ? Math.min(1, b.value / b.total) : 0;
    const filled = Math.round(pct * WIDTH);
    const bar = "█".repeat(filled) + "░".repeat(WIDTH - filled);
    const eta = b.value > 0 ? ((Date.now() - b.start) / b.value) * (b.total - b.value) : 0;
    const etaStr = pct >= 1 ? "done" : `${(eta / 1000).toFixed(1)}s eta`;
    const label = b.label.padEnd(22).slice(0, 22);
    return (
      `${colors.magenta("◆")} ${label} ` +
      colors.cyan(bar) +
      " " +
      colors.bold(pct >= 1 ? "100%" : `${Math.round(pct * 100)}%`.padStart(4)) +
      " " +
      colors.dim(`${b.value}/${b.total} ${etaStr}`)
    );
  }
}

export function createProgress() {
  const p = new Progress();
  p.start();
  return p;
}

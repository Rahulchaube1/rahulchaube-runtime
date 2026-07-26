/**
 * RahulChaube Runtime — Watch Mode Engine.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements file system watching with event debouncing for `--watch` flag.
 *   - Monitors target directory / files using `fs.watch`.
 *   - Debounces file change events (default 100ms) to avoid duplicate runs.
 *   - Triggers callback on file modification or creation.
 *   - Provides `stop()` to close watcher.
 * ─────────────────────────────────────────────────────────────────
 */

import { watch, FSWatcher, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";

export type WatchCallback = (event: string, filename: string | null) => void | Promise<void>;

export class FileWatcher {
  private watcher: FSWatcher | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private active = false;

  constructor(
    private targetPath: string,
    private callback: WatchCallback,
    private debounceMs: number = 100
  ) {}

  public start(): void {
    const absPath = resolve(process.cwd(), this.targetPath);
    if (!existsSync(absPath)) {
      throw new Error(`Watch target does not exist: ${absPath}`);
    }

    const watchDir = statSync(absPath).isDirectory() ? absPath : dirname(absPath);

    this.active = true;
    this.watcher = watch(watchDir, { recursive: true }, (event, filename) => {
      if (!this.active) return;

      // Debounce events
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.callback(event, filename);
      }, this.debounceMs);
    });
  }

  public stop(): void {
    this.active = false;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  public isActive(): boolean {
    return this.active;
  }
}

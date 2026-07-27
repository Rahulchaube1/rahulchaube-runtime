/**
 * RahulChaube Runtime — File Watcher & Incremental Reload Engine.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   - Native recursive file system watching via `fs.watch`.
 *   - Event debouncing (default 100ms) to consolidate rapid file edits.
 *   - Incremental build trigger: invalidates and reloads ONLY changed modules.
 *   - Exposes watcher stats (reload duration, changed module count, total modules).
 * ─────────────────────────────────────────────────────────────────
 */

import { watch, FSWatcher, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { IncrementalCompiler, IncrementalBuildResult } from "../compiler/incremental.ts";

export type WatchCallback = (event: string, filename: string | null) => void | Promise<void>;
export type IncrementalWatchCallback = (result: IncrementalBuildResult, changedFile: string) => void | Promise<void>;

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

export class IncrementalWatcher {
  private fileWatcher: FileWatcher | null = null;
  private compiler = new IncrementalCompiler();

  public lastReloadMs = 0;
  public totalReloads = 0;

  constructor(
    private entryFile: string,
    private onRebuild: IncrementalWatchCallback,
    private debounceMs: number = 100
  ) {}

  public start(): IncrementalBuildResult {
    const initialResult = this.compiler.compile(this.entryFile);

    this.fileWatcher = new FileWatcher(
      this.entryFile,
      async (_event, filename) => {
        const start = performance.now();
        const buildResult = this.compiler.compile(this.entryFile);
        this.lastReloadMs = performance.now() - start;
        this.totalReloads++;

        await this.onRebuild(buildResult, filename || this.entryFile);
      },
      this.debounceMs
    );

    this.fileWatcher.start();
    return initialResult;
  }

  public stop(): void {
    if (this.fileWatcher) {
      this.fileWatcher.stop();
      this.fileWatcher = null;
    }
  }
}

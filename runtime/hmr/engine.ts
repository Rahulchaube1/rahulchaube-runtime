/**
 * RahulChaube Runtime — Hot Module Reload (HMR) Engine.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   - Manages Hot Module Replacement for live runtime state updates.
 *   - Dependency graph invalidation: invalidates modified module and dependents.
 *   - State preservation: calls `module.hot.dispose(data)` to pass state to new instance.
 *   - Module replacement: evaluates updated transpiled source without restarting process.
 *   - Collects and returns reload timing & invalidation statistics.
 * ─────────────────────────────────────────────────────────────────
 */

import { performance } from "node:perf_hooks";
import { resolve } from "node:path";
import { DependencyGraph } from "../compiler/incremental.ts";
import { transpileSource } from "../compiler/transpiler.ts";

export interface HMRData {
  [key: string]: unknown;
}

export interface HotModuleContext {
  data: HMRData;
  accept: (callback?: (mod: unknown) => void) => void;
  dispose: (callback: (data: HMRData) => void) => void;
  active: boolean;
}

export interface HMREloadStats {
  modulePath: string;
  durationMs: number;
  dependentsInvalidatedCount: number;
  statePreserved: boolean;
  timestamp: number;
}

export class HMREngine {
  private graph = new DependencyGraph();
  private moduleExports = new Map<string, Record<string, unknown>>();
  private moduleState = new Map<string, HMRData>();
  private disposeHooks = new Map<string, (data: HMRData) => void>();
  private acceptHooks = new Map<string, (mod: unknown) => void>();
  private history: HMREloadStats[] = [];

  /**
   * Register a module and its exported API into HMR context.
   */
  public registerModule(filePath: string, exportsObj: Record<string, unknown>): void {
    const abs = resolve(process.cwd(), filePath);
    this.moduleExports.set(abs, exportsObj);
  }

  /**
   * Create `module.hot` context object to inject into module execution scope.
   */
  public createHotContext(filePath: string): HotModuleContext {
    const abs = resolve(process.cwd(), filePath);
    if (!this.moduleState.has(abs)) {
      this.moduleState.set(abs, {});
    }

    const data = this.moduleState.get(abs)!;

    return {
      data,
      accept: (callback) => {
        if (callback) this.acceptHooks.set(abs, callback);
      },
      dispose: (callback) => {
        this.disposeHooks.set(abs, callback);
      },
      active: true,
    };
  }

  /**
   * Hot reload a modified module file with new source code.
   */
  public reloadModule(filePath: string, newSource: string): HMREloadStats {
    const start = performance.now();
    const abs = resolve(process.cwd(), filePath);

    // 1. Dependency Graph Invalidation
    const dependents = Array.from(this.graph.getTransitiveDependents(abs));
    for (const dep of dependents) {
      this.moduleExports.delete(dep);
    }

    // 2. State Preservation via Dispose Hook
    let statePreserved = false;
    const disposeFn = this.disposeHooks.get(abs);
    const stateData: HMRData = this.moduleState.get(abs) || {};

    if (disposeFn) {
      try {
        disposeFn(stateData);
        statePreserved = true;
      } catch (err) {
        console.error(`[HMR] Dispose hook failed for ${filePath}:`, err);
      }
    }

    // 3. Module Replacement / Re-transpilation
    const transpiled = transpileSource({ fileName: abs, sourceText: newSource });
    const newExports: Record<string, unknown> = {};
    const modObj = { exports: newExports };

    const hotCtx = this.createHotContext(abs);

    try {
      const fn = new Function(
        "exports",
        "require",
        "module",
        "__filename",
        "__dirname",
        "hot",
        transpiled.code
      );

      fn(
        modObj.exports,
        require,
        modObj,
        abs,
        resolve(abs, ".."),
        hotCtx
      );

      this.moduleExports.set(abs, modObj.exports);

      // 4. Trigger accept hook if registered
      const acceptFn = this.acceptHooks.get(abs);
      if (acceptFn) {
        acceptFn(modObj.exports);
      }
    } catch (err) {
      console.error(`[HMR] Re-execution failed for ${filePath}:`, err);
      throw err;
    }

    const durationMs = performance.now() - start;
    const stats: HMREloadStats = {
      modulePath: abs,
      durationMs,
      dependentsInvalidatedCount: dependents.length,
      statePreserved,
      timestamp: Date.now(),
    };

    this.history.push(stats);
    return stats;
  }

  public getHistory(): HMREloadStats[] {
    return [...this.history];
  }

  public getGraph(): DependencyGraph {
    return this.graph;
  }
}

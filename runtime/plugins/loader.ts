/**
 * RahulChaube Runtime — Plugin Loader.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements a plugin discovery and loading system. Plugins are
 *   CommonJS or TypeScript modules that export a manifest conforming
 *   to RahulChaubePlugin interface. The loader:
 *
 *     - Scans plugin directories for valid plugin manifests
 *     - Validates plugin schemas (name, version, hooks)
 *     - Executes onLoad lifecycle hook
 *     - Provides a hook registry for runtime extension points
 *     - Supports plugin unloading with cleanup via onUnload
 *
 *   Plugin execution points (hooks):
 *     - onLoad()             → called when plugin is first activated
 *     - onUnload()           → called when plugin is deactivated
 *     - onBeforeRun(file)    → called before a script is executed
 *     - onAfterRun(file)     → called after a script finishes
 *     - onResolve(specifier) → can override module resolution
 *     - onTranspile(source)  → can transform source code before compilation
 *
 * WHAT IS NOT IMPLEMENTED:
 *   - Plugin sandboxing / isolated VM context
 *   - Plugin version constraint resolution (semver)
 *   - Plugin hot reload
 *   - Remote plugin installation
 *   - Plugin signature verification
 * ─────────────────────────────────────────────────────────────────
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

export interface RahulChaubePlugin {
  name: string;
  version: string;
  description?: string;
  hooks?: {
    onLoad?: () => void | Promise<void>;
    onUnload?: () => void | Promise<void>;
    onBeforeRun?: (file: string) => void | Promise<void>;
    onAfterRun?: (file: string, success: boolean) => void | Promise<void>;
    onResolve?: (specifier: string) => string | null;
    onTranspile?: (source: string, fileName: string) => string;
  };
}

export interface LoadedPlugin {
  manifest: RahulChaubePlugin;
  path: string;
  loadedAt: number;
  active: boolean;
}

export class PluginLoader {
  private plugins: Map<string, LoadedPlugin> = new Map();

  /**
   * Load a plugin from a file path.
   * The file must export a RahulChaubePlugin-conforming object as its
   * default export or `module.exports`.
   *
   * HOST DEPENDENCY: Uses require() via the host runtime to execute
   * the plugin module. Plugin code runs in the same VM context as the
   * host runtime, not sandboxed.
   */
  public async load(pluginPath: string): Promise<LoadedPlugin> {
    const absPath = resolve(pluginPath);

    if (!existsSync(absPath)) {
      throw new Error(`Plugin not found: ${absPath}`);
    }

    // Require the plugin module via host require()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    let mod: unknown;
    try {
      // Clear require cache to allow re-loading
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      if (typeof require !== "undefined" && require.cache) {
        delete require.cache[absPath];
      }
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require(absPath);
    } catch (err) {
      throw new Error(`Failed to load plugin at ${absPath}: ${(err as Error).message}`);
    }

    const manifest = this.extractManifest(mod, absPath);
    this.validateManifest(manifest, absPath);

    if (this.plugins.has(manifest.name)) {
      throw new Error(`Plugin "${manifest.name}" is already loaded`);
    }

    const loaded: LoadedPlugin = {
      manifest,
      path: absPath,
      loadedAt: Date.now(),
      active: true,
    };

    this.plugins.set(manifest.name, loaded);

    // Run onLoad hook
    if (manifest.hooks?.onLoad) {
      await manifest.hooks.onLoad();
    }

    return loaded;
  }

  /**
   * Scan a directory for plugins. A plugin directory entry is a folder
   * containing a `plugin.json` or `index.js` / `index.ts` file with
   * a valid plugin manifest export.
   */
  public async scanDirectory(dir: string): Promise<string[]> {
    if (!existsSync(dir) || !statSync(dir).isDirectory()) {
      return [];
    }

    const discovered: string[] = [];
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const entryPath = join(dir, entry);
      if (!statSync(entryPath).isDirectory()) continue;

      // Check for plugin.json manifest
      const jsonManifest = join(entryPath, "plugin.json");
      if (existsSync(jsonManifest)) {
        discovered.push(jsonManifest);
        continue;
      }

      // Check for index.js or index.ts plugin entrypoint
      for (const idx of ["index.js", "index.ts"]) {
        const idxPath = join(entryPath, idx);
        if (existsSync(idxPath)) {
          discovered.push(idxPath);
          break;
        }
      }
    }

    return discovered;
  }

  /**
   * Unload a plugin by name. Calls its onUnload hook.
   */
  public async unload(name: string): Promise<boolean> {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;

    if (plugin.manifest.hooks?.onUnload) {
      await plugin.manifest.hooks.onUnload();
    }

    plugin.active = false;
    this.plugins.delete(name);
    return true;
  }

  /** Execute onBeforeRun hooks for all active plugins */
  public async runBeforeRun(file: string): Promise<void> {
    for (const { manifest, active } of this.plugins.values()) {
      if (!active) continue;
      if (manifest.hooks?.onBeforeRun) {
        await manifest.hooks.onBeforeRun(file);
      }
    }
  }

  /** Execute onAfterRun hooks for all active plugins */
  public async runAfterRun(file: string, success: boolean): Promise<void> {
    for (const { manifest, active } of this.plugins.values()) {
      if (!active) continue;
      if (manifest.hooks?.onAfterRun) {
        await manifest.hooks.onAfterRun(file, success);
      }
    }
  }

  /**
   * Run onResolve hooks. Returns the first non-null override,
   * or null if no plugin overrides the specifier.
   */
  public runOnResolve(specifier: string): string | null {
    for (const { manifest, active } of this.plugins.values()) {
      if (!active) continue;
      if (manifest.hooks?.onResolve) {
        const result = manifest.hooks.onResolve(specifier);
        if (result !== null) return result;
      }
    }
    return null;
  }

  /**
   * Run onTranspile hooks in registration order.
   * Each plugin may transform the source; transforms are chained.
   */
  public runOnTranspile(source: string, fileName: string): string {
    let result = source;
    for (const { manifest, active } of this.plugins.values()) {
      if (!active) continue;
      if (manifest.hooks?.onTranspile) {
        result = manifest.hooks.onTranspile(result, fileName);
      }
    }
    return result;
  }

  /** List all currently loaded plugins */
  public list(): LoadedPlugin[] {
    return [...this.plugins.values()];
  }

  /** Get a loaded plugin by name */
  public get(name: string): LoadedPlugin | undefined {
    return this.plugins.get(name);
  }

  /** Number of active plugins */
  public count(): number {
    return this.plugins.size;
  }

  private extractManifest(mod: unknown, path: string): RahulChaubePlugin {
    if (mod && typeof mod === "object") {
      // Default export or module.exports
      const obj = mod as Record<string, unknown>;
      const candidate = obj.default ?? obj;
      if (this.isPlugin(candidate)) return candidate;
    }
    // JSON manifest (plugin.json)
    if (path.endsWith("plugin.json")) {
      try {
        const raw = JSON.parse(readFileSync(path, "utf-8"));
        if (this.isPluginManifest(raw)) return raw as RahulChaubePlugin;
      } catch {
        // fall through
      }
    }
    throw new Error(
      `Plugin at ${path} does not export a valid RahulChaubePlugin. ` +
      `Expected: { name: string, version: string, hooks?: {...} }`
    );
  }

  private isPlugin(obj: unknown): obj is RahulChaubePlugin {
    return (
      obj !== null &&
      typeof obj === "object" &&
      typeof (obj as Record<string, unknown>).name === "string" &&
      typeof (obj as Record<string, unknown>).version === "string"
    );
  }

  private isPluginManifest(obj: unknown): boolean {
    return this.isPlugin(obj);
  }

  private validateManifest(manifest: RahulChaubePlugin, path: string): void {
    if (!manifest.name || manifest.name.trim() === "") {
      throw new Error(`Plugin at ${path}: name must be a non-empty string`);
    }
    if (!manifest.version || !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      throw new Error(
        `Plugin at ${path}: version must be a semver string (e.g. "1.0.0")`
      );
    }
  }
}

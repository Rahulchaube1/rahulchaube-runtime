/**
 * RahulChaube Runtime — Module Loader & Dependency Graph Manager.
 */
import { readFileSync } from "node:fs";
import { resolveModule } from "./resolver.ts";

export interface LoadedModule {
  id: string;
  sourceText: string;
  dependencies: string[];
  evaluationState: "unloaded" | "loading" | "loaded";
}

export class ModuleLoader {
  private cache: Map<string, LoadedModule> = new Map();
  private loadingStack: Set<string> = new Set();

  public load(filePath: string): LoadedModule {
    const absPath = filePath;

    if (this.loadingStack.has(absPath)) {
      console.warn(`[WARN] Circular dependency detected: ${absPath}`);
      return this.cache.get(absPath)!;
    }

    if (this.cache.has(absPath)) {
      return this.cache.get(absPath)!;
    }

    this.loadingStack.add(absPath);
    const sourceText = readFileSync(absPath, "utf-8");

    const mod: LoadedModule = {
      id: absPath,
      sourceText,
      dependencies: [],
      evaluationState: "loading",
    };

    this.cache.set(absPath, mod);

    // Extract import specifiers (regex scanner for ESM imports)
    const importRegex = /(?:import|export)\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(sourceText)) !== null) {
      const specifier = match[1];
      try {
        const resolved = resolveModule(specifier, absPath);
        mod.dependencies.push(resolved.resolvedPath);
      } catch (err) {
        // Specifier resolution deferred to runtime
      }
    }

    mod.evaluationState = "loaded";
    this.loadingStack.delete(absPath);
    return mod;
  }

  public getCache(): Map<string, LoadedModule> {
    return this.cache;
  }

  public clearCache(): void {
    this.cache.clear();
    this.loadingStack.clear();
  }
}

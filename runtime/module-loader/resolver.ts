/**
 * RahulChaube Runtime — Module Resolver.
 *
 * Implements specifier resolution for TS, JS, ESM, CommonJS, and package paths.
 */
import { existsSync, statSync } from "node:fs";
import { resolve, dirname, extname, join } from "node:path";

export const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs", ".json"];

export interface ResolveResult {
  resolvedPath: string;
  extension: string;
  isPackage: boolean;
}

export function resolveModule(specifier: string, parentPath: string): ResolveResult {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  const isAbsolute = specifier.startsWith("/") || specifier.match(/^[a-zA-Z]:[\\/]/);

  if (isRelative || isAbsolute) {
    const basePath = isAbsolute ? specifier : resolve(dirname(parentPath), specifier);

    // 1. Direct file match
    if (existsSync(basePath) && statSync(basePath).isFile()) {
      return { resolvedPath: basePath, extension: extname(basePath), isPackage: false };
    }

    // 2. Extension probe
    for (const ext of SUPPORTED_EXTENSIONS) {
      const candidate = `${basePath}${ext}`;
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        return { resolvedPath: candidate, extension: ext, isPackage: false };
      }
    }

    // 3. Index file probe
    for (const ext of SUPPORTED_EXTENSIONS) {
      const candidate = join(basePath, `index${ext}`);
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        return { resolvedPath: candidate, extension: ext, isPackage: false };
      }
    }
  }

  // 4. Package resolution in node_modules
  let currDir = parentPath ? dirname(parentPath) : process.cwd();
  while (currDir !== dirname(currDir)) {
    const candidate = join(currDir, "node_modules", specifier);
    if (existsSync(candidate)) {
      if (statSync(candidate).isFile()) {
        return { resolvedPath: candidate, extension: extname(candidate), isPackage: true };
      }
      for (const ext of SUPPORTED_EXTENSIONS) {
        const fileCandidate = `${candidate}${ext}`;
        if (existsSync(fileCandidate)) {
          return { resolvedPath: fileCandidate, extension: ext, isPackage: true };
        }
      }
      const indexCandidate = join(candidate, "index.js");
      if (existsSync(indexCandidate)) {
        return { resolvedPath: indexCandidate, extension: ".js", isPackage: true };
      }
    }
    currDir = dirname(currDir);
  }

  throw new Error(`Cannot resolve module '${specifier}' imported from '${parentPath}'`);
}

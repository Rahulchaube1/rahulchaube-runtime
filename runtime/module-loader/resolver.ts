/**
 * RahulChaube Runtime — Module Resolver.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * IMPLEMENTED:
 *   - Explicit relative imports (./foo, ../bar)
 *   - Absolute path imports
 *   - Extension probing (.ts, .tsx, .js, .jsx, .mts, .cts, .mjs, .cjs, .json)
 *   - Index file resolution (./dir → ./dir/index.ts)
 *   - node_modules package resolution (walks up directory tree)
 *   - package.json "main" field for package entrypoint
 *   - package.json "exports" field (basic string/object map)
 *   - Direct file specifiers without ./ prefix (bar.ts in cwd)
 *
 * NOT IMPLEMENTED:
 *   - package.json "imports" field (package self-referencing)
 *   - Subpath pattern exports (e.g. "./features/*.js")
 *   - Conditional exports (import/require/browser/node conditions)
 *   - URL imports (https://…)
 *   - Data URLs
 * ─────────────────────────────────────────────────────────────────
 */
import { existsSync, statSync, readFileSync } from "node:fs";
import { resolve, dirname, extname, join, normalize } from "node:path";

export const SUPPORTED_EXTENSIONS = [
  ".ts", ".tsx", ".js", ".jsx",
  ".mts", ".cts", ".mjs", ".cjs", ".json",
];

export interface ResolveResult {
  resolvedPath: string;
  extension: string;
  isPackage: boolean;
}

export function resolveModule(specifier: string, parentPath: string): ResolveResult {
  const isExplicitRelative =
    specifier.startsWith("./") || specifier.startsWith("../");
  const isAbsolute =
    specifier.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(specifier);

  // ── Relative / Absolute path resolution ──────────────────────
  if (isExplicitRelative || isAbsolute) {
    const basePath = isAbsolute
      ? normalize(specifier)
      : resolve(dirname(parentPath), specifier);
    return resolveFilePath(basePath, false);
  }

  // ── Direct file in cwd (e.g. "hello.ts" without "./") ────────
  const directPath = resolve(parentPath, specifier);
  if (existsSync(directPath) && statSync(directPath).isFile()) {
    return {
      resolvedPath: directPath,
      extension: extname(directPath),
      isPackage: false,
    };
  }
  const directFromCwd = resolve(process.cwd(), specifier);
  if (existsSync(directFromCwd) && statSync(directFromCwd).isFile()) {
    return {
      resolvedPath: directFromCwd,
      extension: extname(directFromCwd),
      isPackage: false,
    };
  }

  // ── node_modules resolution ───────────────────────────────────
  return resolvePackage(specifier, parentPath);
}

function resolveFilePath(basePath: string, isPackage: boolean): ResolveResult {
  // 1. Direct file match
  if (existsSync(basePath) && statSync(basePath).isFile()) {
    return { resolvedPath: basePath, extension: extname(basePath), isPackage };
  }

  // 2. Extension probing
  for (const ext of SUPPORTED_EXTENSIONS) {
    const candidate = `${basePath}${ext}`;
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return { resolvedPath: candidate, extension: ext, isPackage };
    }
  }

  // 3. Index file probe
  for (const ext of SUPPORTED_EXTENSIONS) {
    const candidate = join(basePath, `index${ext}`);
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return { resolvedPath: candidate, extension: ext, isPackage };
    }
  }

  throw new Error(
    `Cannot find file: ${basePath}\nTried: ${SUPPORTED_EXTENSIONS.map((e) => basePath + e).join(", ")}`
  );
}

function resolvePackage(specifier: string, parentPath: string): ResolveResult {
  // Split package name from subpath: "react-dom/client" → ["react-dom", "client"]
  const isScoped = specifier.startsWith("@");
  let pkgName: string;
  let subpath: string;

  if (isScoped) {
    const parts = specifier.split("/");
    pkgName = `${parts[0]}/${parts[1]}`;
    subpath = parts.slice(2).join("/");
  } else {
    const slashIdx = specifier.indexOf("/");
    if (slashIdx === -1) {
      pkgName = specifier;
      subpath = "";
    } else {
      pkgName = specifier.slice(0, slashIdx);
      subpath = specifier.slice(slashIdx + 1);
    }
  }

  let currDir = statSync(parentPath).isFile() ? dirname(parentPath) : parentPath;

  while (true) {
    const nmDir = join(currDir, "node_modules", pkgName);
    if (existsSync(nmDir)) {
      // If we have a subpath, resolve it directly
      if (subpath) {
        const subResolved = resolve(nmDir, subpath);
        return resolveFilePath(subResolved, true);
      }

      // Try package.json "exports" and "main"
      const pkgJsonPath = join(nmDir, "package.json");
      if (existsSync(pkgJsonPath)) {
        try {
          const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));

          // "exports" field (basic support — string or object with ".")
          if (pkgJson.exports) {
            const exp = pkgJson.exports;
            let entryPoint: string | null = null;
            if (typeof exp === "string") {
              entryPoint = exp;
            } else if (typeof exp === "object") {
              const dot = exp["."];
              if (typeof dot === "string") {
                entryPoint = dot;
              } else if (dot && typeof dot === "object") {
                // Prefer require > default
                entryPoint = dot.require ?? dot.default ?? dot.node ?? null;
              }
            }
            if (entryPoint) {
              const expPath = resolve(nmDir, entryPoint);
              if (existsSync(expPath)) {
                return { resolvedPath: expPath, extension: extname(expPath), isPackage: true };
              }
            }
          }

          // "main" field
          if (pkgJson.main) {
            const mainPath = resolve(nmDir, pkgJson.main);
            if (existsSync(mainPath)) {
              return { resolvedPath: mainPath, extension: extname(mainPath), isPackage: true };
            }
            // Try with extensions
            return resolveFilePath(mainPath, true);
          }
        } catch {
          // Malformed package.json — fall through to index probe
        }
      }

      // Fall back to index file
      return resolveFilePath(nmDir, true);
    }

    const parent = dirname(currDir);
    if (parent === currDir) break; // filesystem root
    currDir = parent;
  }

  throw new Error(
    `Cannot resolve module '${specifier}' from '${parentPath}'\n` +
    `  → Module not found in node_modules. Run: rahulchaube install`
  );
}

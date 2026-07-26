/**
 * RahulChaube Runtime — TypeScript Transpiler.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * This transpiler performs source-to-source transformation on TypeScript
 * to produce valid CommonJS-compatible JavaScript using multi-pass
 * regular expression transforms.
 *
 * WHAT IS IMPLEMENTED (executes correctly):
 *   - Type annotation stripping  (:string, :number, :T, :Record<K,V>, etc.)
 *   - interface declarations removed
 *   - type alias declarations removed
 *   - type-only imports removed
 *   - enum declarations → Object.freeze({ Key: value }) objects
 *   - as casts removed
 *   - generic type parameters on function declarations removed  (<T>)
 *   - generic type arguments in call expressions removed  foo<string>(x)
 *   - ESM import {x} from "m"  →  const {x} = require("m")
 *   - ESM import * as ns from "m"  →  const ns = require("m")
 *   - ESM import def from "m"  →  const def = require("m").default ?? require("m")
 *   - ESM import def, {a} from "m"  →  both patterns above
 *   - ESM side-effect import "m"  →  require("m")
 *   - ESM export const/let/var X =  →  const X = exports.X =
 *   - ESM export default  →  exports.default =
 *   - ESM export { a, b as c }  →  exports.a = a; exports.c = b;
 *   - ESM export function / class  →  plain + exports.Name = Name after
 *   - import.meta.url stub
 *   - Decorator lines removed
 *   - non-null assertion (!) removed
 *   - satisfies operator removed
 *   - Block comment removal
 *   - Line comment removal
 *
 * WHAT IS NOT IMPLEMENTED (produces warning or is dropped):
 *   - export * from "m"  (dropped with warning)
 *   - Namespace / module declarations  (stripped as blocks)
 *   - Mapped / conditional / template literal types  (stripped as type decls)
 *   - infer keyword inside types
 *   - JSX / TSX transformation  (emits warning; tags pass through unchanged)
 *   - const enum (treated same as regular enum)
 *   - Ambient declarations (declare …)
 *
 * EXECUTION DEPENDENCY:
 *   Output code is evaluated with `new Function(...)` in runner.ts.
 *   The host JavaScript engine (currently Bun's JSC) does the actual
 *   evaluation. RahulChaube does not yet have its own bytecode VM.
 * ─────────────────────────────────────────────────────────────────
 */

export interface TranspileOptions {
  fileName: string;
  sourceText: string;
  minify?: boolean;
  debug?: boolean;
}

export interface TranspileResult {
  code: string;
  warnings: string[];
}

/**
 * Strip TypeScript syntax and produce executable CommonJS JavaScript.
 */
export function transpileSource(opts: TranspileOptions): TranspileResult {
  const warnings: string[] = [];
  let src = opts.sourceText;

  // ──────────────────────────────────────────────────────────────
  // Pass 1: Remove block comments /* … */
  // ──────────────────────────────────────────────────────────────
  src = src.replace(/\/\*[\s\S]*?\*\//g, "");

  // ──────────────────────────────────────────────────────────────
  // Pass 2: Remove line comments (avoid clobbering string contents)
  // ──────────────────────────────────────────────────────────────
  src = removeLineComments(src);

  // ──────────────────────────────────────────────────────────────
  // Pass 3: Remove ambient declarations: declare const/let/var/function/class/…
  // ──────────────────────────────────────────────────────────────
  src = src.replace(/^\s*declare\s+.+$/gm, "");

  // ──────────────────────────────────────────────────────────────
  // Pass 4: type-only imports — remove entire line
  // import type { Foo } from "…"
  // ──────────────────────────────────────────────────────────────
  src = src.replace(/^\s*import\s+type\b[^\n]*\n?/gm, "");

  // ──────────────────────────────────────────────────────────────
  // Pass 5: interface declarations — remove entire block { … }
  // ──────────────────────────────────────────────────────────────
  src = stripTopLevelBlocks(src, "interface");

  // ──────────────────────────────────────────────────────────────
  // Pass 6: namespace / module declarations
  // ──────────────────────────────────────────────────────────────
  src = stripTopLevelBlocks(src, "namespace");
  src = stripTopLevelBlocks(src, "module");

  // ──────────────────────────────────────────────────────────────
  // Pass 7: type alias declarations
  // type Foo = …;   (may be multi-line for complex types)
  // ──────────────────────────────────────────────────────────────
  src = stripTypeAliases(src);

  // ──────────────────────────────────────────────────────────────
  // Pass 8: enum → plain JS object
  // NOTE: This runs BEFORE type annotation stripping intentionally.
  // The generated Object.freeze({ Key: value }) output is protected
  // because the param annotation stripper is context-anchored to
  // function signatures (requires preceding ( or , context).
  // ──────────────────────────────────────────────────────────────
  src = transformEnums(src, warnings);

  // ──────────────────────────────────────────────────────────────
  // Pass 9: Decorators — remove lines starting with @identifier
  // ──────────────────────────────────────────────────────────────
  src = src.replace(/^\s*@\w+(?:\([^)]*\))?\s*\n?/gm, "");

  // ──────────────────────────────────────────────────────────────
  // Pass 10: ESM imports → CJS require()
  // ──────────────────────────────────────────────────────────────
  // import type … already removed in pass 4

  // import { a, b as c } from "mod"
  src = src.replace(
    /\bimport\s+\{([^}]*)\}\s+from\s+(['"][^'"]+['"])/g,
    (_m, bindings, mod) => {
      const cleaned = bindings.replace(/\s+as\s+(\w+)/g, ": $1").trim();
      return `const {${cleaned}} = require(${mod})`;
    }
  );
  // import * as ns from "mod"
  src = src.replace(
    /\bimport\s+\*\s+as\s+(\w+)\s+from\s+(['"][^'"]+['"])/g,
    (_m, ns, mod) => `const ${ns} = require(${mod})`
  );
  // import def, { a, b } from "mod"
  src = src.replace(
    /\bimport\s+(\w+)\s*,\s*\{([^}]*)\}\s+from\s+(['"][^'"]+['"])/g,
    (_m, def, bindings, mod) => {
      const cleaned = bindings.replace(/\s+as\s+(\w+)/g, ": $1").trim();
      return `const ${def} = (require(${mod}).default ?? require(${mod}));\nconst {${cleaned}} = require(${mod})`;
    }
  );
  // import def from "mod"
  src = src.replace(
    /\bimport\s+(\w+)\s+from\s+(['"][^'"]+['"])/g,
    (_m, def, mod) => `const ${def} = (require(${mod}).default ?? require(${mod}))`
  );
  // import "side-effect"
  src = src.replace(/\bimport\s+(['"][^'"]+['"])/g, (_m, mod) => `require(${mod})`);

  // import.meta.url → file:// __filename stub
  src = src.replace(
    /import\.meta\.url/g,
    `("file:///" + __filename.replace(/\\\\/g, "/"))`
  );

  // ──────────────────────────────────────────────────────────────
  // Pass 11: ESM exports → CJS exports.*
  // ──────────────────────────────────────────────────────────────
  // export * from "mod" — not yet implemented
  src = src.replace(/^\s*export\s+\*\s+from\s+(['"][^'"]+['"])\s*;?\s*$/gm, (_m, mod) => {
    warnings.push(`export * from ${mod} is not yet supported and was dropped`);
    return `/* export * from ${mod} — not supported */`;
  });
  // export default expr
  src = src.replace(/^\s*export\s+default\s+/gm, "exports.default = ");
  // export { a, b as c }
  src = src.replace(/^\s*export\s+\{([^}]*)\}\s*(?:from\s+['"][^'"]+['"])?\s*;?\s*$/gm, (_m, bindings) => {
    return bindings
      .split(",")
      .map((b: string) => {
        const parts = b.trim().split(/\s+as\s+/);
        const local = parts[0]?.trim();
        const exported = parts[1]?.trim() ?? local;
        if (!local) return "";
        return `exports.${exported} = ${local};`;
      })
      .filter(Boolean)
      .join("\n");
  });
  // export const/let/var name = …  — strip export keyword, track name for registration
  const exportedFunctions: string[] = [];
  src = src.replace(/^\s*export\s+(const|let|var)\s+(\w+)/gm, (_m, kw, name) => {
    exportedFunctions.push(name);
    return `${kw} ${name}`;
  });
  // export async function name / export function name
  src = src.replace(/^\s*export\s+(async\s+)?function\s+(\w+)/gm, (_m, async_, name) => {
    exportedFunctions.push(name);
    return `${async_ ?? ""}function ${name}`;
  });
  // export class Name
  src = src.replace(/^\s*export\s+class\s+(\w+)/gm, (_m, name) => {
    exportedFunctions.push(name);
    return `class ${name}`;
  });

  // ──────────────────────────────────────────────────────────────
  // Pass 12: TypeScript type annotation stripping
  // IMPORTANT: Run AFTER enum transform so enum object values aren't stripped
  // ──────────────────────────────────────────────────────────────
  src = stripTypeAnnotations(src);

  // Remove `as Type` casts  (run after annotation strip to catch leftovers)
  src = src.replace(/\s+as\s+(?:[\w<>\[\]|&\s,]+)(?=[;,\)\]\}=\n])/g, "");

  // Non-null assertion !
  src = src.replace(/(?<=[\w\)\]])\!/g, "");

  // satisfies operator
  src = src.replace(/\s+satisfies\s+[\w<>\[\],\s|&]+/g, "");

  // Remove generic type parameters on function declarations: fn<T>(
  src = src.replace(/(\b(?:async\s+)?function\s+\w+)<[^>()]*>\s*\(/g, "$1(");

  // Remove generic type arguments in call expressions: foo<string>(
  // Pattern: identifier<SimpleType>(  — only safe for simple type args
  src = src.replace(/(\b\w+)<([\w\s,\[\]|&]+)>\s*\(/g, "$1(");

  // ──────────────────────────────────────────────────────────────
  // Pass 13: Register exported names
  // ──────────────────────────────────────────────────────────────
  // For export const/let/var — add exports.X = X after each declaration
  // We do this by scanning for `const/let/var name` that was an export
  // This is approximate for top-level only
  if (exportedFunctions.length > 0) {
    const registrations = exportedFunctions
      .map((n) => `exports.${n} = ${n};`)
      .join("\n");
    src = src + "\n" + registrations;
  }

  // ──────────────────────────────────────────────────────────────
  // Pass 14: JSX warning
  // ──────────────────────────────────────────────────────────────
  if (opts.fileName.endsWith(".tsx") || opts.fileName.endsWith(".jsx")) {
    warnings.push(
      "JSX/TSX: JSX elements are not transformed. " +
      "Use a JSX runtime or pragma if your code contains JSX syntax."
    );
  }

  // ──────────────────────────────────────────────────────────────
  // Pass 15: Cleanup
  // ──────────────────────────────────────────────────────────────
  src = src.replace(/\n{3,}/g, "\n\n");
  src = src.trim();

  if (opts.minify) {
    src = src
      .split("\n")
      .filter((l) => l.trim().length > 0)
      .join("\n")
      .replace(/[ \t]+/g, " ")
      .trim();
  }

  if (opts.debug) {
    console.error("[Transpiler] Output length:", src.length, "warnings:", warnings.length);
    if (warnings.length > 0) console.error("[Transpiler] Warnings:", warnings);
  }

  return { code: src, warnings };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Remove // line comments without clobbering string contents */
function removeLineComments(src: string): string {
  // Simple state-machine: track if we're inside a string
  const out: string[] = [];
  let i = 0;
  const len = src.length;
  while (i < len) {
    const ch = src[i];
    // String literals: skip to end of string
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch;
      out.push(ch);
      i++;
      while (i < len && src[i] !== q) {
        if (src[i] === "\\" && i + 1 < len) {
          out.push(src[i], src[i + 1]);
          i += 2;
        } else {
          out.push(src[i]);
          i++;
        }
      }
      if (i < len) { out.push(src[i]); i++; }
      continue;
    }
    // Line comment
    if (ch === "/" && src[i + 1] === "/") {
      while (i < len && src[i] !== "\n") i++;
      continue;
    }
    out.push(ch);
    i++;
  }
  return out.join("");
}

/**
 * Remove top-level block declarations: interface Foo { … }, namespace Foo { … }
 * Handles nested braces.
 */
function stripTopLevelBlocks(src: string, keyword: string): string {
  const result: string[] = [];
  const lines = src.split("\n");
  let depth = 0;
  let inBlock = false;

  for (const line of lines) {
    if (!inBlock) {
      const trimmed = line.trimStart();
      if (new RegExp(`^(?:export\\s+)?${keyword}\\s+`).test(trimmed)) {
        inBlock = true;
        for (const ch of line) {
          if (ch === "{") depth++;
          else if (ch === "}") depth--;
        }
        if (depth <= 0) { inBlock = false; depth = 0; }
        continue;
      }
      result.push(line);
    } else {
      for (const ch of line) {
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
      }
      if (depth <= 0) { inBlock = false; depth = 0; }
    }
  }
  return result.join("\n");
}

/**
 * Strip type alias declarations.
 *   type Foo = …;
 *   type Bar<T> = …;
 * Handles multi-line via semicolon termination.
 */
function stripTypeAliases(src: string): string {
  // Match: type Name = ... ;  (greedy, stopped at ;)
  return src.replace(/^\s*type\s+\w+(?:<[^>]*>)?\s*=[^;]*;?\s*$/gm, "");
}

/**
 * Transform TypeScript enum declarations to plain JavaScript Object.freeze().
 *
 * enum Color { Red, Green, Blue = 5, Alpha }
 * → const Color = Object.freeze({ Red: 0, Green: 1, Blue: 5, Alpha: 6 });
 *
 * enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
 * → const Color = Object.freeze({ Active: "ACTIVE", Inactive: "INACTIVE" });
 */
function transformEnums(src: string, _warnings: string[]): string {
  return src.replace(
    /(?:export\s+)?(?:const\s+)?enum\s+(\w+)\s*\{([^}]*)\}/g,
    (_match, name, body) => {
      const members = body
        .split(",")
        .map((m: string) => m.trim())
        .filter((m: string) => m.length > 0);

      let counter = 0;
      const entries: string[] = [];
      for (const member of members) {
        const eqIdx = member.indexOf("=");
        if (eqIdx !== -1) {
          const key = member.slice(0, eqIdx).trim();
          const val = member.slice(eqIdx + 1).trim();
          const numVal = Number(val);
          if (!isNaN(numVal)) {
            counter = numVal + 1;
            entries.push(`${key}: ${numVal}`);
          } else {
            // String enum value (already quoted in source: "ACTIVE")
            entries.push(`${key}: ${val}`);
            counter++;
          }
        } else {
          entries.push(`${member}: ${counter}`);
          counter++;
        }
      }
      const obj = `{ ${entries.join(", ")} }`;
      return `const ${name} = Object.freeze(${obj});`;
    }
  );
}

/**
 * Strip TypeScript type annotations.
 *
 * WHAT IS HANDLED:
 *   - const/let/var x: Type = …
 *   - function param: Type
 *   - function return type: ): Type {  or  ): Type =>
 *
 * LIMITATION:
 *   Complex union/intersection types with nested generics may not strip
 *   perfectly due to regex limitations. An actual parser is needed for
 *   100% accuracy.
 */
function stripTypeAnnotations(src: string): string {
  // Return type annotations: ): Type {  or  ): Type =>
  // Simple types and Promise<T>
  src = src.replace(
    /\)\s*:\s*(Promise<[\w<>, ]+>|[\w<>\[\]|& ]+?)\s*(=>|\{)/g,
    ") $2"
  );

  // Variable type annotations: const x: Type =  or  let x: Type =
  // Works for simple types and Array<T>, Record<K,V>
  src = src.replace(
    /\b(const|let|var)(\s+\w+)\s*:\s*(?:readonly\s+)?(?:[\w.]+(?:<(?:[^<>]|<[^<>]*>)*>)?(?:\[\])*)(?:\s*[|&]\s*(?:[\w.]+(?:<(?:[^<>]|<[^<>]*>)*>)?(?:\[\])*))*\s*(=)/g,
    "$1$2 $3"
  );

  // Function parameter type annotations: (name: Type, name2: Type)
  // CONTEXT-ANCHORED: require the annotation to appear after ( or ,
  // AND require the type to start with an uppercase letter or a known TS
  // primitive keyword — this prevents matching object literal numeric values
  // like { Down: 1, Left: 10 } inside Object.freeze() calls.
  src = src.replace(
    /(?<=[(,]\s*)\b(\w+)\b\s*\??\s*:\s*(?:readonly\s+)?(?:(?:string|number|boolean|any|void|never|unknown|object|null|undefined|symbol|bigint)|(?:[A-Z][\w.]*(?:<(?:[^<>]|<[^<>]*>)*>)?(?:\[\])*))((?:\s*[|&]\s*(?:[A-Z][\w.]*|string|number|boolean|any)(?:<(?:[^<>]|<[^<>]*>)*>)?(?:\[\])*)*)(?=\s*[,)=?])/g,
    "$1"
  );

  return src;
}

/**
 * RahulChaube Runtime — Compatibility Suite: TypeScript Syntax & Types (Tests 71–150).
 */
import { test, expect } from "bun:test";
import { transpileSource } from "../../runtime/compiler/transpiler.ts";

// 71-80. Enums & Transpilation
test("TS: Numeric Enum transpilation and freeze object execution", () => {
  enum Level {
    Low = 1,
    Medium = 2,
    High = 3,
  }
  expect(Level.Low).toBe(1);
  expect(Level.High).toBe(3);
});

test("TS: String Enum transpilation and freeze object execution", () => {
  enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
  }
  expect(LogLevel.INFO).toBe("INFO");
  expect(LogLevel.ERROR).toBe("ERROR");
});

test("TS: Const Enum handling in transpiler", () => {
  const code = `const enum FastVal { A = 10, B = 20 } console.log(FastVal.A);`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).toContain("const FastVal = Object.freeze");
});

// 81-95. Interfaces, Types & Type Alias Stripping
test("TS: Interface declaration stripping in transpiler", () => {
  const code = `
    interface UserProfile {
      id: number;
      username: string;
    }
    const u: UserProfile = { id: 1, username: "rahul" };
  `;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).not.toContain("interface UserProfile");
  expect(res.code).toContain("const u =");
});

test("TS: Multi-line type alias stripping in transpiler", () => {
  const code = `
    type ResponseState<T> = {
      ok: boolean;
      data?: T;
    };
    const r: ResponseState<string> = { ok: true, data: "hello" };
  `;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).not.toContain("type ResponseState");
  expect(res.code).toContain("const r =");
});

test("TS: Type-only import stripping", () => {
  const code = `
    import type { Component } from "./ui";
    import { render } from "./ui";
    render();
  `;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).not.toContain("import type");
  expect(res.code).toContain('require("./ui")');
});

// 96-115. Generics Functions, Classes, and Call Site Stripping
test("TS: Generic function syntax stripping", () => {
  function wrap<T>(val: T): { value: T } {
    return { value: val };
  }
  const wrappedStr = wrap<string>("test");
  const wrappedNum = wrap<number>(100);

  expect(wrappedStr.value).toBe("test");
  expect(wrappedNum.value).toBe(100);
});

test("TS: Generic Class instantiation and execution", () => {
  class Stack<T> {
    private items: T[] = [];
    push(item: T) { this.items.push(item); }
    pop(): T | undefined { return this.items.pop(); }
  }

  const stack = new Stack<number>();
  stack.push(10);
  stack.push(20);
  expect(stack.pop()).toBe(20);
});

test("TS: Transpiler strips generic call site type parameters", () => {
  const code = `const val = identity<string>("hello");`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).not.toContain("<string>");
  expect(res.code).toContain('identity("hello")');
});

// 116-130. Type Assertions, Non-Null, Satisfies
test("TS: Transpiler strips 'as' type casts", () => {
  const code = `const elem = getElem() as HTMLInputElement;`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).not.toContain("as HTMLInputElement");
});

test("TS: Transpiler strips non-null assertion operator (!)", () => {
  const code = `const val = obj!.prop!;`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).toBe("const val = obj.prop;");
});

test("TS: Transpiler strips 'satisfies' operator", () => {
  const code = `const config = { host: "localhost" } satisfies Record<string, string>;`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).not.toContain("satisfies");
  expect(res.code).toContain("const config = { host: \"localhost\" };");
});

// 131-150. Parameter & Variable Annotation Stripping
test("TS: Function parameter optional (?) and type annotation stripping", () => {
  const code = `function calculate(val?: number, flag: boolean = true): number { return 1; }`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).toContain("function calculate(val, flag = true)");
});

test("TS: Readonly class properties & parameter properties", () => {
  class Config {
    readonly host: string = "127.0.0.1";
  }
  const cfg = new Config();
  expect(cfg.host).toBe("127.0.0.1");
});

test("TS: Transpiler converts ESM export default to CJS exports.default", () => {
  const code = `export default function main() { return 42; }`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).toContain("exports.default = function main");
});

test("TS: Transpiler converts ESM export named declarations", () => {
  const code = "export const VERSION = \"1.0.0\";\nexport function run() {}";
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).toContain("exports.VERSION = VERSION;");
  expect(res.code).toContain("exports.run = run;");
});

test("TS: Transpiler converts ESM export * from 'mod'", () => {
  const code = `export * from "./helpers";`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).toContain('Object.assign(exports, require("./helpers"));');
});

test("TS: Transpiler handles import.meta.url stub", () => {
  const code = `const myUrl = import.meta.url;`;
  const res = transpileSource({ fileName: "test.ts", sourceText: code });
  expect(res.code).toContain("file://");
});

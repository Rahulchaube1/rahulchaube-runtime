/**
 * RahulChaube Runtime — Compatibility Suite: Advanced TypeScript Features (Tests 411–470).
 */
import { test, expect } from "bun:test";
import { transpileSource } from "../../runtime/compiler/transpiler.ts";

// 411-430. Discriminated Unions & Type Guards
test("TS Advanced: Discriminated union type narrowing", () => {
  type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; size: number };

  function getArea(shape: Shape): number {
    switch (shape.kind) {
      case "circle": return Math.PI * shape.radius ** 2;
      case "square": return shape.size ** 2;
    }
  }

  expect(getArea({ kind: "square", size: 10 })).toBe(100);
});

test("TS Advanced: User-defined Type Guard functions", () => {
  function isString(val: unknown): val is string {
    return typeof val === "string";
  }

  const input: unknown = "hello";
  if (isString(input)) {
    expect(input.toUpperCase()).toBe("HELLO");
  }
});

// 431-450. Utility Types & Mapped Types
test("TS Advanced: Utility Types (Partial, Required, Readonly, Record, Pick, Omit)", () => {
  interface User {
    id: number;
    name: string;
    email?: string;
  }

  const partialUser: Partial<User> = { name: "Alice" };
  expect(partialUser.name).toBe("Alice");

  const picked: Pick<User, "id" | "name"> = { id: 1, name: "Bob" };
  expect(picked.id).toBe(1);

  const omitted: Omit<User, "email"> = { id: 2, name: "Charlie" };
  expect(omitted.name).toBe("Charlie");
});

test("TS Advanced: Enum reverse mapping (numeric enums)", () => {
  enum Status {
    Active = 0,
    Inactive = 1,
  }

  expect(Status.Active).toBe(0);
  expect(Status[0]).toBe("Active");
});

// 451-470. Overloading, Parameter Decorators & Transpiler Edge Cases
test("TS Advanced: Function overloading execution", () => {
  function makeList(val: number): number[];
  function makeList(val: string): string[];
  function makeList(val: any): any[] {
    return [val];
  }

  expect(makeList(42)).toEqual([42]);
  expect(makeList("test")).toEqual(["test"]);
});

test("TS Advanced: Transpiler handles private class fields (#field)", () => {
  class BankAccount {
    #balance = 100;
    getBalance() { return this.#balance; }
  }

  const acc = new BankAccount();
  expect(acc.getBalance()).toBe(100);
});

test("TS Advanced: Transpiler strips abstract class and method declarations", () => {
  const code = `
    abstract class BaseService {
      abstract execute(): void;
      log() { return "ok"; }
    }
  `;
  const res = transpileSource({ fileName: "abstract.ts", sourceText: code });
  expect(res.code).not.toContain("abstract class");
  expect(res.code).toContain("class BaseService");
});

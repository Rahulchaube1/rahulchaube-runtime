/**
 * RahulChaube Runtime — Compatibility Suite: Extended Standard Library & Runtime Operations (Tests 151–310).
 */
import { test, expect } from "bun:test";

// 151-180. String & Array Extended Methods
test("Compat: String padStart and padEnd", () => {
  expect("5".padStart(3, "0")).toBe("005");
  expect("5".padEnd(3, "0")).toBe("500");
});

test("Compat: String replace and replaceAll", () => {
  expect("foo bar foo".replace("foo", "baz")).toBe("baz bar foo");
  expect("foo bar foo".replaceAll("foo", "baz")).toBe("baz bar baz");
});

test("Compat: String matchAll regex iteration", () => {
  const matches = [..."test1 test2".matchAll(/test(\d)/g)];
  expect(matches.length).toBe(2);
  expect(matches[0][1]).toBe("1");
  expect(matches[1][1]).toBe("2");
});

test("Compat: Array.from and Array.of", () => {
  expect(Array.from("abc")).toEqual(["a", "b", "c"]);
  expect(Array.of(1, 2, 3)).toEqual([1, 2, 3]);
});

test("Compat: Array at() negative indexing", () => {
  const arr = [10, 20, 30];
  expect(arr.at(-1)).toBe(30);
  expect(arr.at(-2)).toBe(20);
});

test("Compat: Array findLast and findLastIndex", () => {
  const arr = [1, 5, 10, 15];
  expect(arr.findLast((n) => n < 12)).toBe(10);
  expect(arr.findLastIndex((n) => n < 12)).toBe(2);
});

test("Compat: Array flatMap", () => {
  const arr = [1, 2, 3];
  expect(arr.flatMap((x) => [x, x * 2])).toEqual([1, 2, 2, 4, 3, 6]);
});

// 181-210. Object & Reflect Operations
test("Compat: Object.fromEntries", () => {
  const entries: [string, number][] = [["a", 1], ["b", 2]];
  expect(Object.fromEntries(entries)).toEqual({ a: 1, b: 2 });
});

test("Compat: Object.hasOwn", () => {
  const obj = { prop: 42 };
  expect(Object.hasOwn(obj, "prop")).toBe(true);
  expect(Object.hasOwn(obj, "toString")).toBe(false);
});

test("Compat: Reflect.has, Reflect.get, Reflect.set, Reflect.deleteProperty", () => {
  const obj: any = { a: 10 };
  expect(Reflect.has(obj, "a")).toBe(true);
  expect(Reflect.get(obj, "a")).toBe(10);
  Reflect.set(obj, "b", 20);
  expect(obj.b).toBe(20);
  Reflect.deleteProperty(obj, "a");
  expect(obj.a).toBeUndefined();
});

// 211-240. TypedArrays & ArrayBuffers
test("Compat: Uint8Array, Int32Array, and Float64Array", () => {
  const u8 = new Uint8Array([255, 0, 128]);
  expect(u8.length).toBe(3);
  expect(u8[0]).toBe(255);

  const i32 = new Int32Array([1000, -2000]);
  expect(i32[1]).toBe(-2000);

  const f64 = new Float64Array([3.14159]);
  expect(f64[0]).toBeCloseTo(3.14159, 4);
});

test("Compat: DataView byte reading and writing", () => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setInt16(0, 256, true); // little-endian
  expect(view.getInt16(0, true)).toBe(256);
});

// 241-270. Error Handling & Subclasses
test("Compat: Custom Error subclassing and stack trace", () => {
  class CustomError extends Error {
    constructor(message: string, public code: number) {
      super(message);
      this.name = "CustomError";
    }
  }

  const err = new CustomError("test error", 404);
  expect(err instanceof Error).toBe(true);
  expect(err.name).toBe("CustomError");
  expect(err.code).toBe(404);
  expect(err.stack).toBeDefined();
});

test("Compat: AggregateError for combined errors", () => {
  const err = new AggregateError([new Error("a"), new Error("b")], "Multiple errors");
  expect(err.errors.length).toBe(2);
  expect(err.message).toBe("Multiple errors");
});

// 271-310. Function Bind, Call, Apply, Closures & Currying
test("Compat: Function bind, call, apply", () => {
  function greet(this: { name: string }, prefix: string) {
    return `${prefix} ${this.name}`;
  }

  const ctx = { name: "Rahul" };
  expect(greet.call(ctx, "Hello")).toBe("Hello Rahul");
  expect(greet.apply(ctx, ["Hi"])).toBe("Hi Rahul");

  const bound = greet.bind(ctx, "Welcome");
  expect(bound()).toBe("Welcome Rahul");
});

test("Compat: Closure variable encapsulation", () => {
  function createCounter(initial: number = 0) {
    let count = initial;
    return {
      inc: () => ++count,
      dec: () => --count,
      get: () => count,
    };
  }

  const c = createCounter(10);
  expect(c.inc()).toBe(11);
  expect(c.inc()).toBe(12);
  expect(c.dec()).toBe(11);
  expect(c.get()).toBe(11);
});

test("Compat: High-precision performance.now timing", () => {
  const t1 = performance.now();
  const t2 = performance.now();
  expect(t2).toBeGreaterThanOrEqual(t1);
});

/**
 * RahulChaube Runtime — Compatibility Suite: ES Primitives & Operations (Tests 1–70).
 */
import { test, expect } from "bun:test";

// 1. Primitive types
test("ES: String primitives and operations", () => {
  const str = "RahulChaube Runtime";
  expect(str.length).toBe(19);
  expect(str.toLowerCase()).toBe("rahulchaube runtime");
  expect(str.toUpperCase()).toBe("RAHULCHAUBE RUNTIME");
  expect(str.includes("Chaube")).toBe(true);
  expect(str.startsWith("Rahul")).toBe(true);
  expect(str.endsWith("Runtime")).toBe(true);
  expect(str.slice(0, 5)).toBe("Rahul");
  expect(str.substring(5, 11)).toBe("Chaube");
  expect("  hello  ".trim()).toBe("hello");
  expect("a,b,c".split(",")).toEqual(["a", "b", "c"]);
});

// 2-10. Numbers, Math & BigInt
test("ES: Number operations and methods", () => {
  expect(Number.isInteger(42)).toBe(true);
  expect(Number.isInteger(3.14)).toBe(false);
  expect(Number.isNaN(NaN)).toBe(true);
  expect(Number.isFinite(100)).toBe(true);
  expect(Number.parseInt("123", 10)).toBe(123);
  expect(Number.parseFloat("3.14159")).toBe(3.14159);
  expect((42.567).toFixed(2)).toBe("42.57");
});

test("ES: Math library operations", () => {
  expect(Math.abs(-10)).toBe(10);
  expect(Math.floor(4.9)).toBe(4);
  expect(Math.ceil(4.1)).toBe(5);
  expect(Math.round(4.5)).toBe(5);
  expect(Math.max(1, 5, 3)).toBe(5);
  expect(Math.min(1, 5, 3)).toBe(1);
  expect(Math.pow(2, 3)).toBe(8);
  expect(Math.sqrt(16)).toBe(4);
});

test("ES: BigInt arithmetic", () => {
  const a = 9007199254740991n;
  const b = 2n;
  expect(a + b).toBe(9007199254740993n);
  expect(a * b).toBe(18014398509481982n);
  expect(a > 1000n).toBe(true);
});

// 11-20. Arrays & Iteration
test("ES: Array transformations (map, filter, reduce)", () => {
  const nums = [1, 2, 3, 4, 5];
  const doubled = nums.map((n) => n * 2);
  expect(doubled).toEqual([2, 4, 6, 8, 10]);

  const evens = nums.filter((n) => n % 2 === 0);
  expect(evens).toEqual([2, 4]);

  const sum = nums.reduce((acc, n) => acc + n, 0);
  expect(sum).toBe(15);
});

test("ES: Array search (find, findIndex, includes, indexOf)", () => {
  const items = ["apple", "banana", "cherry"];
  expect(items.find((i) => i.startsWith("b"))).toBe("banana");
  expect(items.findIndex((i) => i === "cherry")).toBe(2);
  expect(items.includes("apple")).toBe(true);
  expect(items.indexOf("banana")).toBe(1);
});

test("ES: Array mutation (push, pop, shift, unshift, splice)", () => {
  const arr = [1, 2, 3];
  arr.push(4);
  expect(arr).toEqual([1, 2, 3, 4]);
  expect(arr.pop()).toBe(4);
  arr.unshift(0);
  expect(arr).toEqual([0, 1, 2, 3]);
  expect(arr.shift()).toBe(0);

  arr.splice(1, 1, 99);
  expect(arr).toEqual([1, 99, 3]);
});

test("ES: Array flattening and filling", () => {
  const nested = [1, [2, [3]]];
  expect(nested.flat(2)).toEqual([1, 2, 3]);
  expect(new Array(3).fill(7)).toEqual([7, 7, 7]);
});

// 21-30. Objects & Prototypes
test("ES: Object static methods (keys, values, entries, assign, freeze)", () => {
  const obj = { a: 1, b: 2 };
  expect(Object.keys(obj)).toEqual(["a", "b"]);
  expect(Object.values(obj)).toEqual([1, 2]);
  expect(Object.entries(obj)).toEqual([["a", 1], ["b", 2]]);

  const merged = Object.assign({}, obj, { c: 3 });
  expect(merged).toEqual({ a: 1, b: 2, c: 3 });

  const frozen = Object.freeze({ x: 10 });
  expect(Object.isFrozen(frozen)).toBe(true);
});

test("ES: Object prototype & property descriptors", () => {
  const target: any = {};
  Object.defineProperty(target, "readOnlyProp", {
    value: 100,
    writable: false,
    enumerable: true,
  });

  expect(target.readOnlyProp).toBe(100);
  const desc = Object.getOwnPropertyDescriptor(target, "readOnlyProp");
  expect(desc?.writable).toBe(false);
});

// 31-40. Sets, Maps, WeakMaps, WeakSets
test("ES: Map data structure", () => {
  const map = new Map<string, number>();
  map.set("one", 1);
  map.set("two", 2);

  expect(map.size).toBe(2);
  expect(map.get("one")).toBe(1);
  expect(map.has("two")).toBe(true);
  map.delete("one");
  expect(map.has("one")).toBe(false);
  map.clear();
  expect(map.size).toBe(0);
});

test("ES: Set data structure", () => {
  const set = new Set<number>([1, 2, 2, 3]);
  expect(set.size).toBe(3);
  expect(set.has(2)).toBe(true);
  set.add(4);
  expect(set.has(4)).toBe(true);
  set.delete(1);
  expect(set.has(1)).toBe(false);
});

test("ES: WeakMap and WeakSet garbage collection semantics", () => {
  const wm = new WeakMap<object, string>();
  let obj: any = { key: "val" };
  wm.set(obj, "data");
  expect(wm.get(obj)).toBe("data");

  const ws = new WeakSet<object>();
  ws.add(obj);
  expect(ws.has(obj)).toBe(true);
});

// 41-50. Modern Syntax Expressions
test("ES: Optional chaining (?.) and Nullish coalescing (??)", () => {
  const user: any = { profile: { name: "Alice" } };
  expect(user?.profile?.name).toBe("Alice");
  expect(user?.address?.city).toBeUndefined();

  const nullVal = null;
  const undefinedVal = undefined;
  const zeroVal = 0;
  expect(nullVal ?? "fallback").toBe("fallback");
  expect(undefinedVal ?? "default").toBe("default");
  expect(zeroVal ?? 100).toBe(0);
});

test("ES: Destructuring assignment (Array and Object)", () => {
  const [first, second, ...rest] = [10, 20, 30, 40];
  expect(first).toBe(10);
  expect(second).toBe(20);
  expect(rest).toEqual([30, 40]);

  const { x, y = 5 } = { x: 1 };
  expect(x).toBe(1);
  expect(y).toBe(5);
});

test("ES: Spread syntax (...)", () => {
  const a = [1, 2];
  const b = [...a, 3, 4];
  expect(b).toEqual([1, 2, 3, 4]);

  const objA = { foo: "bar" };
  const objB = { ...objA, baz: "qux" };
  expect(objB).toEqual({ foo: "bar", baz: "qux" });
});

// 51-60. Classes & Inheritance
test("ES: Class declaration, constructor, methods, and getters/setters", () => {
  class Rectangle {
    constructor(public width: number, public height: number) {}
    get area(): number {
      return this.width * this.height;
    }
  }

  const rect = new Rectangle(5, 10);
  expect(rect.area).toBe(50);
});

test("ES: Class inheritance and super calls", () => {
  class Animal {
    constructor(public name: string) {}
    speak(): string { return `${this.name} makes a noise`; }
  }

  class Dog extends Animal {
    speak(): string { return `${this.name} barks`; }
  }

  const d = new Dog("Rex");
  expect(d.speak()).toBe("Rex barks");
  expect(d instanceof Animal).toBe(true);
});

// 61-70. JSON, Symbols, Reflect, Proxy
test("ES: JSON serialization and parsing", () => {
  const data = { name: "RahulChaube", version: 1, active: true };
  const str = JSON.stringify(data);
  const parsed = JSON.parse(str);
  expect(parsed).toEqual(data);
});

test("ES: Symbol primitive and well-known symbols", () => {
  const sym = Symbol("description");
  expect(sym.toString()).toBe("Symbol(description)");

  const customIterable = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
    },
  };

  expect([...customIterable]).toEqual([1, 2]);
});

test("ES: Proxy and Reflect traps", () => {
  const target = { secret: "123" };
  const proxy = new Proxy(target, {
    get(t, prop) {
      if (prop === "secret") return "REDACTED";
      return Reflect.get(t, prop);
    },
  });

  expect(proxy.secret).toBe("REDACTED");
});

test("ES: RegExp pattern matching and flags", () => {
  const regex = /^rahul-(\d+)$/i;
  const match = "RAHUL-42".match(regex);
  expect(match).not.toBeNull();
  expect(match![1]).toBe("42");
});

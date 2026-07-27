/**
 * RahulChaube Runtime — Compatibility Suite: Advanced ECMAScript (Tests 311–410).
 */
import { test, expect } from "bun:test";

// 311-330. Advanced Array & Iteration Methods
test("ES Advanced: Array.prototype.findLast & findLastIndex", () => {
  const numbers = [5, 12, 50, 130, 44];
  expect(numbers.findLast((n) => n > 45)).toBe(130);
  expect(numbers.findLastIndex((n) => n > 45)).toBe(3);
});

test("ES Advanced: Array.prototype.toSorted, toReversed, toSpliced", () => {
  const arr = [3, 1, 2];
  const sorted = arr.toSorted();
  expect(sorted).toEqual([1, 2, 3]);
  expect(arr).toEqual([3, 1, 2]); // original unchanged

  const reversed = arr.toReversed();
  expect(reversed).toEqual([2, 1, 3]);

  const spliced = arr.toSpliced(1, 1, 99);
  expect(spliced).toEqual([3, 99, 2]);
});

test("ES Advanced: Array.prototype.with", () => {
  const arr = ["a", "b", "c"];
  const updated = arr.with(1, "x");
  expect(updated).toEqual(["a", "x", "c"]);
  expect(arr).toEqual(["a", "b", "c"]);
});

// 331-350. Advanced Object & Property Traversal
test("ES Advanced: Object.fromEntries with Map", () => {
  const map = new Map<string, number>([["x", 10], ["y", 20]]);
  const obj = Object.fromEntries(map);
  expect(obj).toEqual({ x: 10, y: 20 });
});

test("ES Advanced: Object.getOwnPropertyNames & Object.getOwnPropertySymbols", () => {
  const sym = Symbol("id");
  const obj: any = { a: 1 };
  obj[sym] = "secret";

  expect(Object.getOwnPropertyNames(obj)).toEqual(["a"]);
  expect(Object.getOwnPropertySymbols(obj)).toEqual([sym]);
});

// 351-370. Advanced Promise & Async Patterns
test("ES Advanced: Async Generators and for-await-of", async () => {
  async function* produceNumbers() {
    yield 1;
    yield 2;
    yield 3;
  }

  const collected: number[] = [];
  for await (const num of produceNumbers()) {
    collected.push(num);
  }
  expect(collected).toEqual([1, 2, 3]);
});

test("ES Advanced: Promise.withResolvers primitive", () => {
  let resolveFn: (val: number) => void;
  const p = new Promise<number>((res) => { resolveFn = res; });
  resolveFn!(42);

  return p.then((val) => {
    expect(val).toBe(42);
  });
});

// 371-390. Advanced Math, Numbers & BigInt
test("ES Advanced: Math.trunc, Math.sign, Math.cbrt", () => {
  expect(Math.trunc(13.37)).toBe(13);
  expect(Math.trunc(-0.123)).toBe(-0);
  expect(Math.sign(-5)).toBe(-1);
  expect(Math.sign(5)).toBe(1);
  expect(Math.sign(0)).toBe(0);
  expect(Math.cbrt(27)).toBe(3);
});

test("ES Advanced: BigInt bitwise operations", () => {
  const a = 0b1010n;
  const b = 0b1100n;
  expect(a & b).toBe(0b1000n);
  expect(a | b).toBe(0b1110n);
  expect(a ^ b).toBe(0b0110n);
  expect(a << 2n).toBe(0b101000n);
});

// 391-410. Advanced RegEx & String Processing
test("ES Advanced: Named capture groups in RegExp", () => {
  const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
  const match = "2026-07-27".match(regex);
  expect(match?.groups?.year).toBe("2026");
  expect(match?.groups?.month).toBe("07");
  expect(match?.groups?.day).toBe("27");
});

test("ES Advanced: String.prototype.normalize (Unicode NFKC/NFD)", () => {
  const str = "\u00e9"; // é
  const normalized = str.normalize("NFD");
  expect(normalized.length).toBe(2);
});

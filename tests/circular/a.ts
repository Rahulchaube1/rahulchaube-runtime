// tests/circular/a.ts — circular dependency detection test
import { getB } from "./b.ts";

export function getA(): string {
  return "A";
}

export function callB(): string {
  return getB();
}

console.log("Module A loaded");
console.log("callB():", callB());

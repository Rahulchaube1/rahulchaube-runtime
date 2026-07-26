// tests/circular/b.ts — circular dependency detection test
import { getA } from "./a.ts";

export function getB(): string {
  return "B (from A: " + getA() + ")";
}

console.log("Module B loaded");

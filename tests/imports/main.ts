// tests/imports/main.ts — tests named + default imports from a sibling module
import { add, multiply, PI } from "./math.ts";
import mathLib from "./math.ts";

const result1 = add(10, 20);
const result2 = multiply(5, 4);

console.log("Named import  — add(10, 20):", result1);
console.log("Named import  — multiply(5, 4):", result2);
console.log("Named import  — PI:", PI);
console.log("Default import — add via default:", mathLib.add(3, 7));

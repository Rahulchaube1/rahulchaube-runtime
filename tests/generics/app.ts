// tests/generics/app.ts — tests TypeScript generic stripping
function identity<T>(value: T): T {
  return value;
}

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

interface Container<T> {
  value: T;
  label: string;
}

const str = identity<string>("hello");
const num = identity<number>(42);
const item = first<number>([10, 20, 30]);

console.log("identity<string>:", str);
console.log("identity<number>:", num);
console.log("first<number>:", item);

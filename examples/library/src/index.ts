export function greet(name: string): string {
  return `Hello, ${name}! — powered by RC Runtime`;
}

export function sum(...ns: number[]): number {
  return ns.reduce((a, b) => a + b, 0);
}

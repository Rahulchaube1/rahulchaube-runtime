const cases = [];
export function test(name, fn) {
  if (typeof fn !== "function") throw new TypeError("test expects a function");
  cases.push({ name, fn });
}
export function equal(actual, expected) {
  if (!Object.is(actual, expected)) throw new Error(`Expected ${String(expected)}, received ${String(actual)}`);
}
export function assert(value, message = "Assertion failed") {
  if (!value) throw new Error(message);
}
export async function runTests() {
  if (!cases.length) throw new Error("No tests registered with rc:test");
  let failed = 0;
  for (const { name, fn } of cases) {
    try { await fn(); console.log("  pass", name); }
    catch (error) { failed++; console.error("  fail", name, String(error), error?.stack ?? ""); }
  }
  if (failed) throw new Error(`${failed} of ${cases.length} tests failed`);
}

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
async function runCase({ name, fn }) {
  try {
    await fn();
    console.log("  pass", name);
    return 0;
  } catch (error) {
    console.error("  fail", name, String(error), error?.stack ?? "");
    return 1;
  }
}
async function* runCases() {
  for (const entry of cases) yield runCase(entry);
}
export async function runTests() {
  if (!cases.length) throw new Error("No tests registered with rc:test");
  // Each test starts after the preceding test has settled in this JS context.
  let failed = 0;
  for await (const count of runCases()) failed += count;
  if (failed) throw new Error(`${failed} of ${cases.length} tests failed`);
}

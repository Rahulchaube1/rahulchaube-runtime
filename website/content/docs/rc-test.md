## Register and assert

Import from `rc:test` inside a test file. A test function can return normally, throw, or return a promise.

```ts
import { assert, equal, test } from "rc:test";

test("resolves an async value", async () => {
  const answer = await Promise.resolve(42);
  assert(Number.isFinite(answer), "expected a finite result");
  equal(answer, 42);
});
```

| Function | Behavior |
| --- | --- |
| `test(name, fn)` | Register a case in the current file. |
| `equal(actual, expected)` | Compare using `Object.is` and throw on a mismatch. Compare fields of objects separately if you need structural checks. |
| `assert(value, message?)` | Throw if the value is falsy. |
| `runTests()` | Execute the registered cases. `rc test` invokes this for you. |

## Discovery and isolation

Use `rc test` from a project directory or `rc test path/to/file.ts` to select a file. Automatic discovery recognizes `.test` or `.spec` before the extensions `.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`, `.jsx` and `.tsx`. It skips hidden directories, `dist` and `node_modules`.

Each file starts in its own JavaScript context. Cases within a file run in registration order. Avoid assuming that a change to a global variable carries into a different file. Filesystem writes still affect the real filesystem.

## Failure behavior

A thrown error or rejected promise fails that case. RC reports the failing name and exits unsuccessfully when any file fails. A file that registers no tests also fails. [Test an HTTP handler](/docs/testing)

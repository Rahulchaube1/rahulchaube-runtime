## Write a test

Save this as `math.test.ts`.

```ts
import { equal, test } from "rc:test";

test("doubles a number", () => equal(21 * 2, 42));
test("awaits a result", async () => {
  equal(await Promise.resolve(42), 42);
});
```

```sh
rc test math.test.ts
```

The terminal reports both passing test names. A failing assertion or rejected promise produces a failure status that CI can use.

## Discover suites

```sh
rc test
```

RC discovers supported JavaScript and TypeScript files whose names end in `.test` or `.spec` before the extension. It skips hidden directories, dependencies and `dist`. Pass explicit filenames to run selected suites. Each suite gets a fresh JavaScript context.

## Test a service

A generated RC Web project includes a test that sends a request to `app.handle()` and checks the response. It runs without opening a network listener. [Testing guide](/docs/testing) · [Assertion API](/docs/rc-test)

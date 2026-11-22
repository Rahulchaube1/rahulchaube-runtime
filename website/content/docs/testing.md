## Write the tests

In the same `hello` project, create `greetings.test.ts` beside `app.ts`. Import the router directly. Calling `app.handle` exercises route matching and your handler in memory.

```ts
import { equal, test } from "rc:test";
import { app } from "./app";

test("creates a greeting", async () => {
  const result = await app.handle({
    method: "POST", path: "/greetings", body: '{"name":"Ada"}'
  });
  equal(result.status, 201);
  equal(JSON.parse(result.body).hello, "Ada");
});

test("requires a name", async () => {
  const result = await app.handle({
    method: "POST", path: "/greetings", body: "{}"
  });
  equal(result.status, 400);
  equal(JSON.parse(result.body).error, "A name is required");
});
```

## Run one file or the suite

```sh
rc test greetings.test.ts
rc test
```

The first command runs your two new cases. The second also discovers the starter test. Each file gets its own JavaScript context. Tests within a file run in registration order.

## Diagnose a failure

Change the expected success status to `200` and rerun the file. The runner reports the failing test name and exits with a nonzero status. Restore the expectation to `201` and rerun the suite before continuing. [Bundle and run](/docs/bundler) · [Test API](/docs/rc-test)

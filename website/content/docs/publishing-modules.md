## Write the library

In an empty directory create `numbers.ts`. Export the functions you want another RC application to import.

```ts
export function double(value: number): number {
  return value * 2;
}
```

Create a test in `numbers.test.ts`.

```ts
import { equal, test } from "rc:test";
import { double } from "./numbers";

test("doubles a value", () => equal(double(21), 42));
```

## Build and fingerprint

```sh
rc test
rc build numbers.ts --outfile dist/numbers-1.0.0.mjs
sha256sum dist/numbers-1.0.0.mjs
```

Use `shasum -a 256` on macOS or `certutil -hashfile dist/numbers-1.0.0.mjs SHA256` on Windows. Host this exact file at a versioned HTTPS URL. The installer accepts one bundled module per dependency, up to 16 MiB.

## Share the import

Give consumers the URL, lowercase SHA-256 digest, import name and an example. They enter those values in `rc.json`, run `rc install` and import `double` by the chosen name. Publish a new URL and digest for changed code. [Working manifest example](/docs/package-manager)

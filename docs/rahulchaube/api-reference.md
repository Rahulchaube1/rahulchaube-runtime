# Built-in libraries

Use `rc:web` to serve HTTP and `rc:test` to register async or synchronous tests. `equal(actual, expected)` compares values using Object.is. `assert(value, message)` checks truthiness. The `rc:fs` library reads and writes UTF-8 files.

```ts
import { readText, writeText, readJSON, writeJSON } from "rc:fs";
writeJSON("status.json", { ready: true });
console.log(readJSON("status.json").ready);
```

[Online guide](https://www.rahulchaube.space/docs/api)

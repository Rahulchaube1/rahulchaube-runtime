## Read and write text

The `rc:fs` functions are synchronous. Relative paths resolve against the directory where you started RC. Create parent directories before writing. A read or write error throws.

```ts
import { readText, writeText } from "rc:fs";

writeText("message.txt", "Hello from RC\n");
console.log(readText("message.txt").trim());
```

`writeText(path, text)` creates the file or replaces its contents. `readText(path)` returns its UTF-8 text.

## Work with JSON

```ts
import { readJSON, writeJSON } from "rc:fs";

writeJSON("status.json", { ready: true });
const status = readJSON<{ ready: boolean }>("status.json");
console.log(status.ready);
```

`writeJSON(path, value)` uses two-space indentation and a trailing newline. `readJSON(path)` parses the text and throws for invalid JSON. Its optional TypeScript type argument describes the expected shape to the editor. Validate externally supplied data at runtime.

## Handle missing files

Use a `try` block around file operations when absence or invalid data affects your program’s flow. The runtime operates with the current user’s filesystem permissions. [Host API reference](/docs/runtime)

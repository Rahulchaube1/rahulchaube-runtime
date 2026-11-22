## Modules and TypeScript

RC evaluates ECMAScript modules using QuickJS-NG. The esbuild integration handles local JavaScript, TypeScript, CommonJS dependencies and JSON. Use explicit or resolvable relative paths. Literal imports can be bundled ahead of execution. Dynamic module names and packages with host-specific features need individual verification.

```ts
const name: string = RC.args[0] ?? "world";
await Promise.resolve();
console.log("Hello,", name);
```

Type annotations are removed before execution. Start with `rc init` to get the editor declarations and `tsconfig.json`. Run a TypeScript checker separately for diagnostics.

## Host globals

| API | Use |
| --- | --- |
| `RC.version` | Read the installed version string. |
| `RC.args` | Read the frozen array of script arguments. |
| `console.log/info/warn/error` | Write to the standard output or error stream. |
| `setTimeout(fn, delay)`, `clearTimeout(id)` | Schedule or cancel a callback. |
| `RC.readText`, `RC.writeText` | Access text files. `rc:fs` adds JSON helpers. |
| `RC.listen(host, port, handler)` | Open a native HTTP listener. `rc:web` adds routing. |

## Asynchronous execution

The runtime drains promise jobs and dispatches timers and HTTP callbacks. A listening server keeps the program alive. A top-level await that can never settle with no remaining timers or servers produces a diagnostic. [Execution lifecycle](/docs/architecture#execution-lifecycle) · [Compatibility](/docs/compatibility)

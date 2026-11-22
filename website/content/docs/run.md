## Execute a saved script

Save this as `hello.ts`.

```ts
const name: string = RC.args[0] ?? "world";
console.log("Hello, " + name + "!");
```

```sh
rc run hello.ts -- Rahul
```

The task prints `Hello, Rahul!`. Arguments after the entry are available through `RC.args`. The optional `--` separates program arguments from the invocation.

## Restart on edits

```sh
rc run --watch hello.ts -- Rahul
```

Watch mode restarts the application when the entry or an imported file changes. It keeps watching after a compile error so you can fix the source. Use Ctrl+C to stop.

## Understand execution

QuickJS-NG evaluates JavaScript and esbuild handles TypeScript and module graphs. RC provides timers, file access and HTTP with the [built-in libraries](/docs/api). An uncaught error produces a failure status. Run [rc check](/docs/check) when you need type diagnostics and [rc build](/docs/build) to save a bundle.

## Restart a program

```sh
rc run --watch server.ts
```

The watcher tracks the entry and its resolved imports. After a successful rebuild it replaces the running program. Changes to in-memory application state disappear on restart.

## Rebuild a bundle

```sh
rc build --watch server.ts --outfile dist/server.mjs
```

Use build watch when another process consumes the output file. Run watch is convenient when RC also owns the running program. Place `--watch` before the entry filename.

## Recover from an edit

In the starter, change a response in `app.ts`, save and request it again. If an edit has a syntax error, the watcher prints the build error and waits for the next change. Save the correction and the next successful build takes effect. Stop either watcher with Ctrl+C. [CLI reference](/docs/cli)

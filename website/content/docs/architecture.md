## From source to a module

The `rc` CLI is a native Go executable. For modules that need resolution or TypeScript transformation, the host asks esbuild to resolve the graph and emit ES module code. A self-contained JavaScript entry can use a direct evaluation path. Built-in imports resolve to RC’s bundled library source.

## Execution lifecycle

1. QuickJS-NG creates a runtime and an execution context.
2. RC binds console output, arguments, filesystem access and the HTTP bridge into that context.
3. The entry module evaluates. The host drains pending promise jobs and watches for unhandled rejections.
4. Timers and Go HTTP events resume JavaScript callbacks on the context’s owning thread.
5. When the module has settled and no live work remains, the context and native resources close.

## Bundles and runtime services

`rc build` writes an ES module bundle. Built-in `rc:` imports stay external in that output and resolve against RC at execution time. RC Web’s JavaScript router matches paths while Go handles the network connection. Test files start independent JS contexts. [Source code](https://github.com/Rahulchaube1/rahulchaube-runtime/tree/main/native) · [Compatible APIs](/docs/compatibility)

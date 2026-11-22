# Runtime architecture

The native Go host embeds QuickJS-NG through quickjs-go and compiles TypeScript with esbuild. Local ES modules, literal dynamic imports, top-level await, CommonJS dependencies and JSON are supported through the bundled module graph. `console`, `setTimeout`, `clearTimeout` and `RC.args` are available in the host.

RC executes TypeScript without type checking. Applications using Node built-ins, Bun globals, browser DOM APIs, native Node add-ons or dynamic module names may require another host. JS programs run with the filesystem and network privileges of the current user.

[Online guide](https://www.rahulchaube.space/docs/architecture)

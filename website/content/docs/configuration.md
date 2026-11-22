## Manifest fields

`rc.json` declares pinned ES modules. An empty project can use the following manifest.

```json
{
  "dependencies": {}
}
```

Each entry under `dependencies` maps an import name to an object containing `url` and `sha256`. The URL must use HTTPS. The digest is a lowercase, 64-character hexadecimal SHA-256 of the complete module file. Lowercase package names may include digits, dots, underscores and hyphens. Scoped names such as `@team/util` are supported.

## Lookup and cache

`rc install` searches upward from its working directory for the nearest `rc.json`. Building and running resolve the nearest manifest from the entry file’s directory. Install dependencies after editing the manifest. RC stores verified modules in `.rc/modules` and shares downloaded bytes through an OS user cache. [Complete working manifest](/docs/package-manager)

## TypeScript and arguments

`rc init` supplies `rc.d.ts` for the built-in modules, `RC` and timers. Its `tsconfig.json` describes a strict, no-emit TypeScript project for your editor. Use `rc build` for the runnable ES module.

Pass application-specific options after the script filename, for example `rc run hello.ts -- Ada`. Read them from `RC.args`. Configure an HTTP listener with the options to `app.listen`. [RC Web](/docs/rc-web)

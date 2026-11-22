# Installing pinned modules

Try the example library by saving this manifest as `rc.json` in a project directory. It pins the exact bytes of the public module.

```json
{
  "dependencies": {
    "hello": {
      "url": "https://www.rahulchaube.space/modules/hello-1.0.0.mjs",
      "sha256": "9a509a7beb871fd88b57e4886e3a6cc6631cad58a2a418a663517668acba25e8"
    }
  }
}
```

Run `rc install` and import from `"hello"` in your code. Commit rc.json to version control. The digest pins the bytes for each dependency. Verified modules live in .rc/modules and in your OS user cache. Use `rc install --offline` to restore a project from that cache.



```ts
import { greet, sum } from "hello";
console.log(greet("Ada"), sum(10, 20, 12));
```

To publish your own library, use `rc build library.ts --outfile library.mjs`, host that file over HTTPS and compute its SHA-256 digest. Each dependency is a UTF-8 JavaScript bundle up to 16 MiB. Bundle relative imports before publishing. This package format is independent of the npm registry. For npm dependencies, use your project’s npm-compatible package manager. The native bundler can import pure JS packages whose runtime APIs it supports.

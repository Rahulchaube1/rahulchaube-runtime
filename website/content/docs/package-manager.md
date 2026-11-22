## Pin a module

In a project directory, save the following `rc.json`. The digest identifies the exact JavaScript bytes. The example library is publicly available from the RC website.

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

## Install and import

Run `rc install`. Save this code as `main.ts` and run `rc run main.ts`.

```ts
import { greet, sum } from "hello";

console.log(greet("Ada"));
console.log(sum(20, 22));
```

The output includes `Hello, Ada! — powered by RC Runtime` and `42`. RC resolves the import name through the installed project module.

## Restore offline

Copy `rc.json` and `main.ts` into a fresh directory on the same machine, using the same OS account. Run `rc install --offline` there and run the program again. This restores verified bytes from the user cache. A missing digest causes the offline command to fail. An online install fills the cache.

Commit the manifest when updating a dependency. Review the source and use the publisher’s digest for the intended release. [Manifest fields](/docs/configuration) · [Publish a library](/docs/publishing-modules)

## Generated files

Run `rc init hello` and open the new directory. The starter includes these files.

| File | Purpose |
| --- | --- |
| `app.ts` | Creates the router and exports the application. |
| `server.ts` | Imports the router and opens the HTTP listener. |
| `app.test.ts` | Exercises the router without opening a port. |
| `rc.json` | Declares externally hosted, checksum-pinned ES modules. |
| `rc.d.ts` | Describes the RC globals and built-in libraries to your editor. |
| `tsconfig.json` | Configures TypeScript tooling for the starter. |

## Generated output

`rc install` writes verified dependencies under `.rc/modules`. Keep `rc.json` in version control so another developer can install the same bytes. The bundler writes to the path you supply with `--outfile`.

## Add application code

Create a sibling module and import it using a relative path from `app.ts`. Keep listener startup in `server.ts` so tests can import the application independently. [Project configuration](/docs/configuration) · [Test your service](/docs/testing)

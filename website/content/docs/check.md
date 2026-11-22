## Check a TypeScript file

Run semantic diagnostics without executing a program or emitting a bundle. RC includes TypeScript 5.9.3, the TypeScript standard library declarations and declarations for RC’s host APIs. It works offline.

Save this as `price.ts`.

```ts
export const price: number = "21";
```

```sh
rc check price.ts
```

The checker reports `TS2322` at the assignment and exits with a failure status. Change the initializer to the number `21`, then rerun the command.

## Check a project

```sh
rc check
rc check --project tsconfig.json
```

With no arguments RC looks for the nearest tsconfig. It honors project includes, excludes and compiler options. Without a config, it discovers source under the current directory and uses strict checking with ES2022 libraries. You can pass explicit source files or select one project with `-p`. Diagnostics include paths, line numbers and TypeScript codes. RC skips rechecking its bundled default library declarations on each invocation. Your own declaration files are checked. Set `skipDefaultLibCheck` to `false` in the project to also check the default libraries.

## Imports and RC libraries

Local imports participate in the same type check. The generated RC Web starter includes declarations for `rc:web`, `rc:test`, `rc:fs`, timers and `RC`. Run [rc install](/docs/install) before checking code that imports a pinned external module. Source dependencies still need types compatible with your project’s compiler settings.

## Use in CI

```sh
rc fmt --check .
rc check -p tsconfig.json
rc test
```

Each command returns a failure status on a failed check. Use [rc build](/docs/build) when you want an output file.

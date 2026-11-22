## Format a file or directory

`rc fmt` formats JavaScript, TypeScript, JSX and TSX in place. The bundled TypeScript formatter uses two-space indentation and consistent spacing. It preserves types, comments, existing semicolon style, the byte-order mark and CRLF line endings.

Save this as `price.ts`.

```ts
const price:number=21;
console.log(price*2);
```

```sh
rc fmt price.ts
rc fmt --check price.ts
rc run price.ts
```

The formatted declaration reads `const price: number = 21;`. The program prints `42`. Formatting a file a second time should leave its contents unchanged.

## Format a project

Run `rc fmt src` to walk a directory, or `rc fmt` to start at the working directory. You can pass multiple files and directories. Discovery skips hidden directories, dependencies, build output and coverage folders. Specify a file directly to format one selected source.

## Check formatting in CI

```sh
rc fmt --check src
```

Check mode prints paths that need formatting and exits with a failure status. It leaves files untouched. A syntax error also fails the command. RC parses every selected file before applying edits. Use the [type checker](/docs/check) to diagnose type errors.

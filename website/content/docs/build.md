## Build a TypeScript entry

Save a file named `answer.ts`.

```ts
const answer: number = 6 * 7;
console.log(answer);
```

```sh
rc build answer.ts --outfile dist/answer.mjs
rc run dist/answer.mjs
```

The output is an ES module. Running it prints `42`. RC uses esbuild to resolve imports and strip TypeScript syntax. Run [rc check](/docs/check) separately for semantic type diagnostics.

## Follow imported files

```sh
rc build --watch answer.ts --outfile dist/answer.mjs
```

Watch mode follows the entry and its imports. Fixing a syntax error triggers another build. Use Ctrl+C to stop. A one-shot build exits with failure if the entry or one of its dependencies cannot be compiled.

## Ship a bundle

Use an explicit output path. Local dependencies and installed, pinned modules can be included in the graph. RC built-in imports stay external in emitted bundles, so run bundles that import them on an RC host. [Bundler reference](/docs/bundler) · [Package installation](/docs/install)

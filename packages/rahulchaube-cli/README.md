# rahulchaube-cli

The user-facing command-line interface for **RahulChaube Runtime** — an
independent, MIT-licensed fork of Bun.

```sh
rahulchaube --help
```

## What this is

`rahulchaube-cli` is a TypeScript front-end that provides the branded developer
experience: a colorful CLI, animated spinners, progress bars, beautiful tables,
Unicode icons, better error messages, interactive prompts, and a broad command
surface (package manager, project generator, diagnostics, AI-assisted tools, and
a plugin system).

Engine operations (runtime, transpiler, bundler, installer, test runner) are
delegated to the underlying MIT-licensed Bun engine binary, preserving
API-compatibility and performance.

## Project layout

```
src/
  index.ts          command dispatcher
  ui/               premium terminal UI (colors, spinner, progress, table, …)
  engine/bun.ts     engine delegation
  commands/         one file per command
  util/             fs, config, semver helpers
```

## Development

```sh
bun run start --help
bun run typecheck
```

## License

MIT. This is a fork of Bun; all upstream copyright notices and licenses are
preserved. Not affiliated with or endorsed by the Bun authors.

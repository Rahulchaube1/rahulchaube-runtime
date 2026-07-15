# Architecture Guide

RahulChaube Runtime is organized as two cooperating layers:

1. **The engine** — the upstream Bun core (Rust, Zig, and C++), which provides
   the JavaScript runtime, transpiler, bundler, test runner, and package
   manager. This layer is API-compatible with Node.js and web standards.
2. **The RahulChaube CLI** — an independent, TypeScript front-end that provides
   the branded developer experience, command surface, and tooling. It lives in
   `packages/rahulchaube-cli`.

```
packages/rahulchaube-cli/
├── bin/
│   └── rahulchaube.ts          # entrypoint
├── src/
│   ├── index.ts                # command dispatcher
│   ├── ui/                     # premium terminal UI toolkit
│   │   ├── colors.ts           # ANSI color helpers
│   │   ├── spinner.ts          # animated spinners
│   │   ├── progress.ts         # multi-bar progress
│   │   ├── table.ts            # box-drawn tables
│   │   ├── icons.ts            # unicode icon set
│   │   ├── banner.ts           # branded banners
│   │   ├── logger.ts           # structured logging
│   │   └── prompt.ts           # interactive prompts
│   ├── engine/
│   │   └── bun.ts              # delegation to the engine binary
│   ├── commands/               # one file per command
│   │   ├── install.ts  add.ts  remove.ts  update.ts
│   │   ├── run.ts     test.ts  build.ts  create.ts
│   │   ├── doctor.ts  audit.ts licenses.ts graph.ts
│   │   ├── why.ts     outdated.ts cache.ts benchmark.ts
│   │   ├── explain.ts optimize.ts migrate.ts analyze.ts
│   │   └── plugins.ts
│   ├── commands/templates.ts   # project templates
│   └── util/                   # fs, config, semver helpers
└── package.json
```

## Design principles

- **Modularity** — each command is an isolated, testable module.
- **Extensibility** — new commands are plain async functions registered in
  `src/index.ts`.
- **No hard dependencies** — the UI toolkit is dependency-free so the CLI runs
  on any Node or Bun runtime.
- **Brand separation** — the CLI never claims to be the official Bun, and all
  upstream licenses/attribution are preserved.

## Command dispatch

`bin/rahulchaube.ts` calls `main(argv)`, which:

1. Parses global flags (`--help`, `--version`, `--json`, `--no-color`).
2. Looks up the command in the `COMMANDS` registry.
3. Invokes the command's async handler with `(args, flags)`.
4. Returns a process exit code.

## Engine delegation

Commands that need the runtime (install, run, test, build) delegate to the
`bun` engine binary via `engine/bun.ts`. The CLI controls branding, UX, and
diagnostics; the engine performs the heavy lifting. This keeps the rebrand
self-contained and the engine unmodified.

## Workspaces & monorepos

`rahulchaube` reads `package.json` workspaces and `rahulchaube.json` to support
parallel task execution, smart caching, and incremental builds — mirroring the
engine's workspace support.

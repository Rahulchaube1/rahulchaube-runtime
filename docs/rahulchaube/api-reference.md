# API Reference

This reference covers the RahulChaube Runtime **CLI** and the **UI toolkit**
exposed by `rahulchaube-cli`.

## CLI commands

| Command | Signature | Description |
| --- | --- | --- |
| `install` | `rahulchaube install [--production] [--frozen-lockfile]` | Install dependencies |
| `add` | `rahulchaube add <pkg...> [--dev] [--exact]` | Add dependencies |
| `remove` | `rahulchaube remove <pkg...>` | Remove dependencies |
| `update` | `rahulchaube update [pkg...] [--latest] [--interactive]` | Update dependencies |
| `run` | `rahulchaube run <script> [-- ...args]` | Run a package.json script |
| `test` | `rahulchaube test [filters...] [--watch] [--coverage]` | Run tests |
| `build` | `rahulchaube build [entry...] [--minify] [--sourcemap] [--splitting]` | Bundle |
| `create` | `rahulchaube create [template] [name]` | Scaffold a project |
| `doctor` | `rahulchaube doctor [--fix]` | Diagnose & repair |
| `audit` | `rahulchaube audit [--json]` | Scan vulnerabilities |
| `licenses` | `rahulchaube licenses [--json]` | License report |
| `graph` | `rahulchaube graph` | Dependency graph |
| `why` | `rahulchaube why <pkg>` | Dependency trace |
| `outdated` | `rahulchaube outdated [--json]` | Outdated report |
| `cache` | `rahulchaube cache clean [--all]` | Clean caches |
| `benchmark` | `rahulchaube benchmark [--json]` | Run benchmarks |
| `explain` | `rahulchaube explain <error\|file\|concept>` | Explain diagnostics |
| `optimize` | `rahulchaube optimize [--apply]` | Performance suggestions |
| `migrate` | `rahulchaube migrate [npm\|yarn\|pnpm\|bun]` | Project migration |
| `analyze` | `rahulchaube analyze [--json]` | Project health |
| `plugins` | `rahulchaube plugins install\|list\|update\|remove [name]` | Plugin management |

All commands return a standard process exit code (`0` success, non-zero error).

## Configuration (`rahulchaube.json`)

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `telemetry` | boolean | `false` | Anonymous usage telemetry |
| `autoInstall` | boolean | `true` | Auto-install missing deps on run |
| `concurrency` | number | `8` | Parallel download/concurrency limit |
| `registry` | string | (engine default) | Custom npm registry |
| `cacheDir` | string | (engine default) | Package cache directory |
| `theme` | string | `"default"` | UI theme (`default`/`light`/`minimal`) |

## UI toolkit

Importable from `rahulchaube-cli/ui`:

```ts
import { colors, icons, spinner, createProgress, table, log, prompt } from "rahulchaube-cli/ui";
```

- **`colors`** — `bold`, `dim`, `red`, `green`, `yellow`, `blue`, `magenta`,
  `cyan`, `gray`, `brand`, `link`, `rgb(r,g,b)`, `reset`.
- **`icons`** — Unicode icon map (`logo`, `rocket`, `package`, `shield`, …).
- **`spinner(msg)`** — animated spinner with `.text()`, `.suffix()`,
  `.succeed()`, `.fail()`, `.stop()`.
- **`createProgress()`** — multi-bar progress with `add(label, total)`,
  `.set()`, `.increment()`, `.done()`.
- **`table(rows, columns)`** — box-drawn tables with alignment & color.
- **`log`** — `info`, `success`, `warn`, `error`, `debug`, `plain`, `raw`.
- **`prompt`** — `text()`, `confirm()`, `select()` for interactivity.

## Engine delegation

```ts
import { runEngine, engineName, enginePath } from "rahulchaube-cli/engine/bun";

const result = runEngine(["run", "build"], { inherit: true });
```

`runEngine` forwards arguments to the underlying engine binary, preserving the
branded environment.

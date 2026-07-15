<p align="center">
  <h1 align="center">◆ RahulChaube Runtime</h1>
</p>

<p align="center">
  A next-generation JavaScript &amp; TypeScript runtime and developer platform.
</p>

<div align="center">
  <a href="#install">Installation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="docs/rahulchaube/getting-started.md">Getting Started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="docs/rahulchaube/architecture-guide.md">Architecture</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="docs/rahulchaube/plugin-guide.md">Plugins</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="docs/rahulchaube/api-reference.md">API</a>
  <br />
</div>

## What is RahulChaube Runtime?

**RahulChaube Runtime** is an all-in-one toolkit for JavaScript and TypeScript
applications. It ships as a single executable called `rahulchaube`.

At its core is the **RahulChaube runtime**, a fast JavaScript runtime designed as
a drop-in replacement for Node.js. It executes TypeScript, JSX, and modern
JavaScript with minimal startup overhead and a small memory footprint.

```bash
rahulchaube run index.tsx            # TS and JSX supported out-of-the-box
```

The `rahulchaube` command-line tool also implements a test runner, script runner,
and a modern package manager with a redesigned, premium developer experience:

```bash
rahulchaube test                     # run tests
rahulchaube run start                # run the `start` script in `package.json`
rahulchaube add react                # install a package
rahulchaube create react my-app      # scaffold a new project
```

## Why a new identity?

RahulChaube Runtime is an **independent, MIT-licensed fork** of the Bun project.
It is **not** the official Bun, is **not** affiliated with, and is **not**
endorsed by the Bun authors (Oven LLC). The original code, its licenses, and all
copyright notices are preserved. This project exists to provide its own
identity, command surface, and developer experience on top of a proven engine.

> All credits, copyrights, and license terms from the upstream Bun project are
> retained in [`LICENSE.md`](./LICENSE.md). This rebrand only changes the
> product name, CLI, documentation, and user-facing assets.

## Install

RahulChaube Runtime supports Linux (x64 & arm64), macOS (x64 & Apple Silicon),
and Windows (x64 & arm64).

```sh
# via npm (global)
npm install -g rahulchaube-cli

# via the bundled engine
rahulchaube --version
```

> **Note:** The native engine is built from the upstream Bun sources. On systems
> where the prebuilt engine is available, `rahulchaube` delegates to it while
> presenting the rebranded experience.

### Quick start

```sh
rahulchaube create react my-app     # scaffold a React app
cd my-app
rahulchaube install                 # install dependencies
rahulchaube run dev                 # start the dev server
```

## Command overview

### Package manager

| Command | Description |
| --- | --- |
| `rahulchaube install` | Install dependencies |
| `rahulchaube add <pkg>` | Add a dependency (`--dev`) |
| `rahulchaube remove <pkg>` | Remove a dependency |
| `rahulchaube update [pkg]` | Update dependencies |
| `rahulchaube why <pkg>` | Explain why a dependency is installed |
| `rahulchaube outdated` | List outdated dependencies |
| `rahulchaube audit` | Scan for vulnerabilities |
| `rahulchaube licenses` | Summarize dependency licenses |
| `rahulchaube graph` | Visualize the dependency graph |
| `rahulchaube cache clean` | Clean package caches |

### Execute & build

| Command | Description |
| --- | --- |
| `rahulchaube run <script>` | Run a `package.json` script |
| `rahulchaube test` | Run the test suite |
| `rahulchaube build [entry]` | Bundle your project (`--minify`, `--sourcemap`, `--splitting`) |
| `rahulchaube benchmark` | Run performance benchmarks |

### Project & tooling

| Command | Description |
| --- | --- |
| `rahulchaube create <template> [name]` | Scaffold a project (`react`, `next`, `express`, `hono`, `library`, `cli`) |
| `rahulchaube doctor [--fix]` | Diagnose and repair your environment |
| `rahulchaube migrate [from]` | Migrate from npm / yarn / pnpm / bun |
| `rahulchaube plugins install|list|update|remove` | Manage third-party plugins |

### AI-assisted tools

| Command | Description |
| --- | --- |
| `rahulchaube explain <error\|concept>` | Explain an error or concept |
| `rahulchaube optimize [--apply]` | Suggest (and apply) performance fixes |
| `rahulchaube analyze [--json]` | Analyze project health & diagnostics |
| `rahulchaube explain` | Human-readable diagnostics |

## Documentation

- [Getting Started](docs/rahulchaube/getting-started.md)
- [Installation](docs/rahulchaube/installation.md)
- [Migration Guide](docs/rahulchaube/migration-guide.md)
- [Performance Guide](docs/rahulchaube/performance-guide.md)
- [Architecture Guide](docs/rahulchaube/architecture-guide.md)
- [Plugin Guide](docs/rahulchaube/plugin-guide.md)
- [API Reference](docs/rahulchaube/api-reference.md)
- [Benchmarks](docs/rahulchaube/benchmarks.md)

## Contributing

Refer to [`CONTRIBUTING.md`](./CONTRIBUTING.md) to start contributing. This is a
fork — please keep the original MIT license and attribution intact when
submitting changes.

## License

RahulChaube Runtime is distributed under the **MIT License**. The original Bun
project and all bundled third-party libraries retain their respective licenses,
detailed in [`LICENSE.md`](./LICENSE.md).

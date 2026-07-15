# Installation

RahulChaube Runtime ships as a single executable, `rahulchaube`. The engine
underneath is the proven, MIT-licensed Bun core; the brand, CLI, and developer
experience are reimplemented independently.

## Supported platforms

| Platform | Architectures |
| --- | --- |
| Linux | x64, arm64 |
| macOS | x64, Apple Silicon (arm64) |
| Windows | x64, arm64 |

> Linux users: kernel 5.6+ is recommended (minimum 5.1).

## Install methods

### npm (recommended)

```sh
npm install -g rahulchaube-cli
```

### From source

The engine is built from the upstream Bun sources. Prerequisites: a C/C++
toolchain, Zig, and Rust.

```sh
git clone <your-fork-url> rahulchaube
cd rahulchaube
rahulchaube install            # install dev dependencies via the engine
bun run build:release          # build the native engine (uses the engine build scripts)
```

### Docker

```sh
docker run --rm --init rahulchaube/rahulchaube rahulchaube --version
```

## Verify

```sh
rahulchaube --version
rahulchaube doctor
```

`rahulchaube doctor` runs a set of environment checks (engine present, manifest
found, dependency tree consistent, VCS hygiene). Pass `--fix` to auto-repair
common issues.

## Upgrading

```sh
npm update -g rahulchaube-cli
```

## CPU requirements

On x64, some instructions require a baseline CPU (e.g. AVX2). If you see
"illegal instruction" errors, use a baseline build of the engine.

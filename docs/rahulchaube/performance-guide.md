# Performance Guide

RahulChaube Runtime is built for speed. This guide explains the levers you can
pull to get the most out of it.

## Startup latency & cold start

- **Use the engine binary directly.** `rahulchaube run` forwards to the native
  engine, so startup is identical to the underlying runtime (often < 10 ms for
  small scripts).
- **Prefer TypeScript & JSX directly.** The transpiler runs ahead-of-time with
  zero config, avoiding a separate `tsc` step.
- **Enable bytecode caching** for hot paths (handled by the engine's loader).
- **Bundle CLI tools** with `rahulchaube build --compile` to ship a single
  binary with no startup penalty.

## The bundler

```sh
rahulchaube build src/index.ts \
  --outdir dist \
  --minify \
  --sourcemap \
  --splitting \
  --target browser
```

- `--minify` runs the fast minifier (whitespace + identifiers).
- `--splitting` emits shared chunks for better caching.
- `--target` tunes the output for `browser`, `bun`, or `node`.

## Dependency resolution

The package manager is optimized for:

- **Concurrent downloads** — the installer fetches packages in parallel using
  the engine's HTTP client.
- **Content-addressable cache** — identical packages are stored once.
- **Lockfile parsing** — the `bun.lock` parser is incremental and fast.
- **Isolated installs** — `linker = "isolated"` in `rahulchaube.json` produces
  deterministic, conflict-free trees.

Run `rahulchaube benchmark` to measure install and build time on your project.

## Memory

- The runtime uses a dedicated allocator tuned for short-lived allocations.
- Use `RAHULCHAUBE_MAX_HEAP` / `NODE_OPTIONS=--max-old-space-size=` to bound
  memory for constrained environments.
- `rahulchaube analyze` reports large files and memory hotspots.

## Profiling

- `rahulchaube doctor` validates the environment before profiling.
- Use the engine's inspector (`--inspect`) for CPU and heap profiles.
- `rahulchaube benchmark` produces timing reports you can track over time.

## Measuring your wins

```sh
rahulchaube benchmark --filter http
```

Compare runs across commits to catch regressions early.

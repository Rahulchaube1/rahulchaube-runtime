# Benchmarks

RahulChaube Runtime inherits the performance characteristics of its engine and
adds instrumentation to track them over time.

## Running benchmarks

```sh
rahulchaube benchmark
```

If a `bench/` directory exists (or a `benchmark` script in `package.json`), the
runner executes your suites and prints timing reports. Use `--json` for
machine-readable output.

## What we measure

| Area | Metric |
| --- | --- |
| Startup | Time to first executed line (ms) |
| Cold start | Time from process spawn to ready |
| Install | Resolved + linked packages per second |
| Downloads | Concurrent package fetch throughput |
| Transpile | Files/sec for TS/JSX |
| Bundle | Output bytes and build time |
| Runtime | HTTP req/sec, latency percentiles |

## Reproducible runs

For CI, pin the engine and disable telemetry:

```sh
RAHULCHAUBE_TELEMETRY=0 rahulchaube benchmark --json > result.json
```

Track `result.json` across commits to catch regressions.

## Sample numbers (reference)

> Numbers below are illustrative placeholders for the documented methodology.
> Run `rahulchaube benchmark` on your hardware for real figures.

| Workload | RahulChaube | Node.js |
| --- | --- | --- |
| `hello world` startup | ~6 ms | ~45 ms |
| Install 1k deps | ~1.2 s | ~12 s |
| Transpile 10k files | ~0.9 s | ~6 s |
| HTTP req/sec | high | baseline |

## Adding your own benchmark

```ts
// bench/sum.bench.ts
import { bench, run } from "rahulchaube";

bench("sum-1k", () => {
  let n = 0;
  for (let i = 0; i < 1000; i++) n += i;
  return n;
});

await run();
```

Then:

```sh
rahulchaube benchmark bench/sum.bench.ts
```

## Performance dashboard

Pair `rahulchaube analyze` (static diagnostics) with `rahulchaube benchmark`
(dynamic timings) for a full picture of your project's health and speed.

# Benchmarks

RahulChaube Runtime tracks performance with a reference benchmark suite.

## Run locally

```sh
cd benchmarks
rahulchaube install
rahulchaube run suite.bench.ts
```

The suite measures real, machine-local timings for representative workloads
(array ops, object allocation, string concat, recursion).

## Reporting

- Save results to `benchmarks/data/` as JSON.
- **Never publish numbers as project-wide claims** unless they come from a
  standardized, repeatable environment.
- `benchmarks/data/example.json` is **placeholder** data only — it is clearly
  labeled and must not be cited as a result.

## Website

The `/benchmarks` page renders charts **only when real data is present**, and
shows a clear "example data" label for placeholders. We do not claim
RahulChaube Runtime is faster than Bun or Node unless benchmarks demonstrate it.

### Compare installed CLI startup

Use the two installed launchers on the same machine. For example, measure 50 fresh CLI processes per release with hyperfine. Repeat with `--help` or `run ./hello.ts` to compare other workloads.

```sh
hyperfine --shell=none --warmup 5 --runs 50 '/path/to/old/bin/rahulchaube --version' '/path/to/new/bin/rahulchaube --version'
```

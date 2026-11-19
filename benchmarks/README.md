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

Supply paths to two installed launchers. Run the same command on each installation, on the same machine. The benchmark alternates the order, discards five warm-up pairs and prints elapsed wall-clock milliseconds for 50 fresh processes per installation.

```sh
python3 benchmarks/cli-startup.py /path/to/old/bin/rahulchaube /path/to/new/bin/rahulchaube --version
python3 benchmarks/cli-startup.py /path/to/old/bin/rahulchaube /path/to/new/bin/rahulchaube run ./hello.ts
```

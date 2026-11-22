# Comparing RC Runtime

On Linux or macOS, place RC Runtime, Bun, Node.js 24+ and npm on PATH. Run the comparison with Python 3.9 or newer.

```sh
python3 benchmarks/compare.py --samples 25 > results.json
```

Pass `--rc`, `--bun`, `--node` or `--npm` to select a specific executable. The harness verifies the exact output and exit status of each program. Each engine gets three warmups followed by interleaved fresh processes in a seeded random order. The OS file cache stays warm. Elapsed time includes process startup and exit.

The programs print a constant, import a typed value from a second file, or perform one million integer additions. npm runs each program as a package script using Node. These workloads measure script execution. They do not exercise dependency resolution, package installation or sustained HTTP traffic.

The JSON includes the OS, CPU, versions, sample times, median, p95, binary size and median per-run peak resident memory from `wait4`. Binary size describes the executable file only. Peak RSS for a package script is the operating system’s per-process high-water measurement. Results depend on the hardware and software versions.

[Published measurements](https://www.rahulchaube.space/benchmarks) · [Raw JSON](https://www.rahulchaube.space/benchmarks.json)

The older Bun-hosted tooling microbenchmarks remain available with `bun benchmarks/runner.ts`.

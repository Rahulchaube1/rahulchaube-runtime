# Comparing RC Runtime

On Linux or macOS, place RC Runtime, Bun, Node.js 24+ and npm on PATH. Run the comparison with Python 3.9 or newer.

```sh
python3 benchmarks/compare.py --samples 25 > results.json
```

Pass `--rc`, `--bun`, `--node` or `--npm` to select a specific executable. The harness verifies the exact output and exit status of each program. Each engine gets three warmups followed by interleaved fresh processes in a seeded random order. The OS file cache stays warm. Elapsed time includes process startup and exit.

The programs print a constant, import a typed value from a second file, or perform one million integer additions. npm runs each program as a package script using Node. These workloads measure script execution. They do not exercise dependency resolution, package installation or sustained HTTP traffic.

The Linux install comparison uses an isolated cache for each tool. The harness downloads `yocto-queue@1.2.2` once per tool, then installs offline in fresh directories. RC restores one hash-pinned ES module. Bun and npm materialize a registry package from a lockfile. The harness checks that all three produced the same module bytes after every run. Project setup and output verification are outside the timed interval.

```sh
python3 benchmarks/install.py --samples 25 > install-results.json
```

The JSON includes the OS, CPU, versions, sample times, median, p95, binary size and median per-run peak resident memory from `wait4`. Binary size describes the executable file only. Peak RSS for a package script is the operating system’s per-process high-water measurement. Results depend on the hardware and software versions.

[Published measurements](https://www.rahulchaube.space/benchmarks) · [Execution samples](https://www.rahulchaube.space/benchmarks.json) · [Install samples](https://www.rahulchaube.space/install-benchmarks.json)

## Measure the six native commands

From the repository root on Linux, place the released `rc` executable on PATH. Python 3.9 or newer runs the fixtures. The command below generates all six charts’ data. Add `--command fmt` to run a single workload, or `--rc /path/to/rc` to select a binary.

```sh
python3 benchmarks/toolkit.py --samples 11 --warmups 2 > toolkit-results.json
```

For each command, the harness measures 1, 8 and 32 inputs in seeded, shuffled order. Each observation starts a fresh process. It verifies the formatted files, type-check result, runnable bundle, passing assertions, restored module bytes or program output after each observation. Select **Median** or **P95** on a chart to see the middle observation or nearest-rank 95th percentile. The raw samples record each measured duration. [Command charts](https://www.rahulchaube.space/commands) · [Download the measurements](https://www.rahulchaube.space/toolkit-benchmarks.json)

The older Bun-hosted tooling microbenchmarks remain available with `bun benchmarks/runner.ts`.

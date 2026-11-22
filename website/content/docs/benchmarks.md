## Measure the six native commands

From the repository root on Linux, place the released `rc` executable on PATH. Python 3.9 or newer runs the fixtures. The command below generates all six charts’ data. Add `--command fmt` to run a single workload, or `--rc /path/to/rc` to select a binary.

```sh
python3 benchmarks/toolkit.py --samples 11 --warmups 2 > toolkit-results.json
```

For each command, the harness measures 1, 8 and 32 inputs in seeded, shuffled order. Each observation starts a fresh process. It verifies the formatted files, type-check result, runnable bundle, passing assertions, restored module bytes or program output after each observation. Select **Median** or **P95** on a chart to see the middle observation or nearest-rank 95th percentile. The raw samples record each measured duration. [Command charts](/commands) · [Download the measurements](/toolkit-benchmarks.json)

## Reproduce execution timings

Clone the repository and run the harness from its root on Linux or macOS. Install Python 3.9+, RC, Bun, Node.js 24+ and npm. Use the documented executable options to select exact versions.

```sh
python3 benchmarks/compare.py --samples 25 > results.json
```

The harness compares fresh processes executing the same three programs. It verifies program output, performs three warmups, then interleaves timed processes in a seeded randomized order. npm launches a Node package script for this comparison. The result includes median time, p95, peak resident memory and executable size.

## Reproduce a cached install

On Linux, run the install harness with network access for the initial downloads.

```sh
python3 benchmarks/install.py --samples 25 > install-results.json
```

Each tool restores a single dependency into a fresh project with a warm cache. RC restores a pinned ES module. Bun and npm restore the package from their lockfiles. The harness hashes the resulting JavaScript bytes after each run.

## Interpret the results

Compare a workload that resembles your application and record the OS, CPU and tool versions. Startup time, arithmetic throughput, package installation and memory use answer different questions. [Published results](/benchmarks) · [Execution samples](/benchmarks.json) · [Install samples](/install-benchmarks.json)

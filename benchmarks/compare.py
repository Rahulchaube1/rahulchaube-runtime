"""Compare fresh processes running identical programs on Linux or macOS."""
import argparse
import datetime
import json
import math
import os
import platform
import random
import shutil
import statistics
import subprocess
import tempfile
import time
from pathlib import Path


def measure(command, directory, expected):
    with tempfile.TemporaryFile() as output:
        start = time.perf_counter_ns()
        child = subprocess.Popen(command, cwd=directory, stdout=output, stderr=subprocess.STDOUT)
        _, status, usage = os.wait4(child.pid, 0)
        elapsed = (time.perf_counter_ns() - start) / 1e6
        child.returncode = os.waitstatus_to_exitcode(status)
        output.seek(0)
        actual = output.read().decode().strip()
        if child.returncode or actual != expected:
            raise RuntimeError(f"{command} exited {child.returncode}: {actual!r} (expected {expected!r})")
        divisor = 1024 * 1024 if platform.system() == "Darwin" else 1024
        return round(elapsed, 3), round(usage.ru_maxrss / divisor, 3)


def sample_workload(commands, directory, expected, rng, count):
    samples = {engine: [] for engine in commands}
    for round_no in range(count + 3):
        order = list(commands)
        rng.shuffle(order)
        for engine in order:
            observation = measure(commands[engine], directory, expected)
            if round_no >= 3:
                samples[engine].append(observation)
    result = {}
    for engine, observations in samples.items():
        times, memory = zip(*observations)
        result[engine] = {
            "median_ms": round(statistics.median(times), 2),
            "p95_ms": round(sorted(times)[math.ceil(.95 * len(times)) - 1], 2),
            "peak_mib": round(statistics.median(memory), 2),
            "samples_ms": times,
        }
    return result


def load_engines(parser, args):
    engines = {}
    for name in ["rc", "bun", "node", "npm"]:
        executable = shutil.which(getattr(args, name))
        if not executable:
            parser.error(f"missing {name}; pass --{name} /path/to/{name}")
        executable = os.path.abspath(executable)
        engines[name] = {
            "path": executable,
            "version": subprocess.check_output([executable, "--version"], text=True).strip(),
            "executable_mib": None if name == "npm" else round(os.stat(executable).st_size / 2**20, 2),
        }
    return engines


def run():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ["rc", "bun", "node", "npm"]:
        parser.add_argument("--" + name, default=name)
    parser.add_argument("--samples", type=int, default=25)
    args = parser.parse_args()
    if args.samples < 1 or not hasattr(os, "wait4"):
        parser.error("Use Linux or macOS and specify at least one sample")
    engines = load_engines(parser, args)
    # npm launches the same Node executable through its ordinary package script.
    os.environ["PATH"] = str(Path(engines["node"]["path"]).parent) + os.pathsep + os.environ["PATH"]
    workloads = {
        "hello": ("hello.mjs", "hello"),
        "typescript": ("main.ts", "42"),
        "integer_loop": ("loop.mjs", "1783293664"),
    }
    rng = random.Random(42)
    result = {}
    with tempfile.TemporaryDirectory() as temp:
        directory = Path(temp)
        (directory / "hello.mjs").write_text('console.log("hello");\n')
        (directory / "lib.ts").write_text("export const value: number = 42;\n")
        (directory / "main.ts").write_text('import {value} from "./lib.ts"; console.log(value);\n')
        (directory / "loop.mjs").write_text("let sum = 0; for (let i = 0; i < 1000000; i++) sum = (sum + i) >>> 0; console.log(sum);\n")
        scripts = {name: "node " + filename for name, (filename, _) in workloads.items()}
        (directory / "package.json").write_text(json.dumps({"type": "module", "scripts": scripts}))
        for name, (filename, expected) in workloads.items():
            commands = {
                "rc": [engines["rc"]["path"], "run", filename], "bun": [engines["bun"]["path"], filename],
                "node": [engines["node"]["path"], filename], "npm": [engines["npm"]["path"], "run", "--silent", name],
            }
            result[name] = sample_workload(commands, directory, expected, rng, args.samples)
    cpu = platform.processor()
    if platform.system() == "Linux":
        cpu = next((line.split(":", 1)[1].strip() for line in Path("/proc/cpuinfo").read_text().splitlines()
                    if line.startswith("model name")), platform.machine())
    return {
        "date": datetime.datetime.now(datetime.timezone.utc).date().isoformat(),
        "system": f"{platform.system()} {platform.release()} {platform.machine()}", "cpu": cpu,
        "samples": args.samples, "warmups": 3,
        "engines": {name: {key: value for key, value in info.items() if key != "path"} for name, info in engines.items()},
        "workloads": result,
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))

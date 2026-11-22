"""Time real RC commands on deterministic local workloads. Python 3.9+, Linux."""

import argparse
import hashlib
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
from datetime import date
from pathlib import Path

COMMANDS = ("fmt", "check", "build", "test", "install", "run")
SIZES = (1, 8, 32)
UNITS = {
    "fmt": "files",
    "check": "files",
    "build": "imports",
    "test": "tests",
    "install": "modules",
    "run": "imports",
}


def execute(argv, cwd, env):
    return subprocess.run(
        argv, cwd=cwd, env=env, capture_output=True, text=True, check=True, timeout=90
    ).stdout


class Fixture:
    def __init__(self, root, rc, command, size):
        self.root, self.rc, self.command, self.size = root, rc, command, size
        self.env = dict(os.environ, XDG_CACHE_HOME=str(root / "cache"))
        self.files = []
        self.modules = {}
        root.mkdir()
        if command in ("run", "build"):
            imports = []
            names = []
            for i in range(size):
                name = f"value{i}"
                (root / f"lib{i}.ts").write_text(f"export const {name}: number = {i + 1};\n")
                imports.append(f'import {{ {name} }} from "./lib{i}";')
                names.append(name)
            (root / "main.ts").write_text(
                "\n".join(imports + ["console.log(" + " + ".join(names) + ");\n"])
            )
            self.args = (
                ["run", "main.ts"]
                if command == "run"
                else ["build", "main.ts", "--outfile", "bundle.mjs"]
            )
        elif command in ("fmt", "check"):
            src = root / "src"
            src.mkdir()
            for i in range(size):
                path = src / f"file{i}.ts"
                path.write_text(f"export const value: number = {i};\n")
                self.files.append(path)
            (root / "tsconfig.json").write_text(
                json.dumps({"compilerOptions": {"strict": True, "lib": ["ES2022"]}, "include": ["src"]})
            )
            self.args = ["fmt", "src"] if command == "fmt" else ["check", "-p", "tsconfig.json"]
        elif command == "test":
            tests = ['import { test, equal } from "rc:test";']
            tests += [f'test("case {i}", () => equal({i} + 1, {i + 1}));' for i in range(size)]
            (root / "suite.test.ts").write_text("\n".join(tests))
            self.args = ["test", "suite.test.ts"]
        else:
            cache = root / "cache" / "rc-runtime"
            cache.mkdir(parents=True)
            deps = {}
            for i in range(size):
                source = f"export const value = {i};\n".encode()
                digest = hashlib.sha256(source).hexdigest()
                self.modules[digest] = source
                (cache / (digest + ".mjs")).write_bytes(source)
                deps[f"fixture-{i}"] = {"url": f"https://example.invalid/{i}.mjs", "sha256": digest}
            (root / "rc.json").write_text(json.dumps({"dependencies": deps}))
            self.args = ["install", "--offline"]

    def sample(self):
        if self.command == "fmt":
            for i, path in enumerate(self.files):
                path.write_text(f"export const value:number={i};\n")
        if self.command == "install":
            shutil.rmtree(self.root / ".rc", ignore_errors=True)
        if self.command == "build":
            (self.root / "bundle.mjs").unlink(missing_ok=True)
        start = time.perf_counter_ns()
        out = execute([self.rc, *self.args], self.root, self.env)
        elapsed = (time.perf_counter_ns() - start) / 1_000_000
        if self.command in ("build", "run"):
            if self.command == "build":
                out = execute([self.rc, "run", "bundle.mjs"], self.root, self.env)
            assert out.strip() == str(self.size * (self.size + 1) // 2), out
        elif self.command == "fmt":
            assert all(
                p.read_text() == f"export const value: number = {i};\n"
                for i, p in enumerate(self.files)
            )
        elif self.command == "check":
            assert out.strip() == f"Checked {self.size} source file(s)", out
        elif self.command == "test":
            assert (
                sum(line.lstrip().startswith("pass case ") for line in out.splitlines()) == self.size
            ), out
        else:
            assert all(
                (self.root / ".rc" / "modules" / (key + ".mjs")).read_bytes() == value
                for key, value in self.modules.items()
            )
        return round(elapsed, 3)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--rc", default="rc")
    p.add_argument("--command", choices=COMMANDS)
    p.add_argument("--samples", type=int, default=11)
    p.add_argument("--warmups", type=int, default=2)
    args = p.parse_args()
    if platform.system() != "Linux":
        p.error("the published harness uses Linux user-cache paths")
    if args.samples < 1 or args.warmups < 0:
        p.error("use at least one sample and nonnegative warmups")
    rc = shutil.which(args.rc)
    if not rc:
        p.error("RC executable was not found")
    rc = str(Path(rc).resolve())
    cpu = next(
        (
            s.split(":", 1)[1].strip()
            for s in Path("/proc/cpuinfo").read_text().splitlines()
            if s.startswith("model name")
        ),
        platform.machine(),
    )
    result = {
        "date": str(date.today()),
        "system": platform.system() + " " + platform.release(),
        "arch": platform.machine(),
        "cpu": cpu,
        "executable_sha256": hashlib.sha256(Path(rc).read_bytes()).hexdigest(),
        "version": subprocess.check_output([rc, "--version"], text=True).strip(),
        "samples": args.samples,
        "warmups": args.warmups,
        "commands": {},
    }
    commands = [args.command] if args.command else COMMANDS
    with tempfile.TemporaryDirectory(prefix="rc-toolkit-bench-") as folder:
        for command in commands:
            fixtures = [
                Fixture(Path(folder) / f"{command}-{size}", rc, command, size) for size in SIZES
            ]
            samples = {size: [] for size in SIZES}
            rng = random.Random(42)
            for iteration in range(args.warmups + args.samples):
                rng.shuffle(fixtures)
                for fixture in fixtures:
                    elapsed = fixture.sample()
                    if iteration >= args.warmups:
                        samples[fixture.size].append(elapsed)
            result["commands"][command] = {
                "unit": UNITS[command],
                "rows": [
                    {
                        "size": s,
                        "median_ms": round(statistics.median(samples[s]), 3),
                        "p95_ms": sorted(samples[s])[math.ceil(len(samples[s]) * 0.95) - 1],
                        "samples_ms": samples[s],
                    }
                    for s in SIZES
                ],
            }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()

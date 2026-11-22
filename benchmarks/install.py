"""Time installing one pinned ES module into fresh projects from warm caches on Linux."""
import argparse
import hashlib
import json
import os
import platform
import random
import shutil
import statistics
import subprocess
import tempfile
import time
from pathlib import Path

PACKAGE = "yocto-queue"
PACKAGE_MANIFEST = "package.json"
VERSION = "1.2.2"
DIGEST = "2eabf3096793c43934ef127fb50238dcba93074fb54f943fc62aeab616769dfc"


def write_manifests(directory):
    module_url = f"https://cdn.jsdelivr.net/npm/{PACKAGE}@{VERSION}/index.js"
    (directory / "rc.json").write_text(json.dumps({"dependencies": {PACKAGE: {"url": module_url, "sha256": DIGEST}}}))
    (directory / PACKAGE_MANIFEST).write_text(json.dumps({"private": True, "dependencies": {PACKAGE: VERSION}}))


def install(command, directory, environment, engine):
    start = time.perf_counter_ns()
    subprocess.run(command, cwd=directory, env=environment, stdout=subprocess.DEVNULL, check=True)
    elapsed = (time.perf_counter_ns() - start) / 1e6
    module = directory / (f".rc/modules/{DIGEST}.mjs" if engine == "rc" else f"node_modules/{PACKAGE}/index.js")
    if hashlib.sha256(module.read_bytes()).hexdigest() != DIGEST:
        raise ValueError(f"{engine} installed different module bytes")
    return round(elapsed, 3)


def benchmark(root, executables, samples):
    environment = {**os.environ, "XDG_CACHE_HOME": str(root / "cache"), "npm_config_cache": str(root / "npm-cache")}
    bun_flags = ["--cache-dir", str(root / "bun-cache"), "--ignore-scripts", "--silent"]
    npm_flags = ["--ignore-scripts", "--no-audit", "--no-fund", "--silent"]
    online = {"rc": ["install"], "bun": ["install", *bun_flags], "npm": ["install", *npm_flags]}
    offline = {"rc": ["install", "--offline"], "bun": ["install", "--offline", "--frozen-lockfile", *bun_flags],
               "npm": ["ci", "--offline", *npm_flags]}
    manifests = {"rc": ["rc.json"], "bun": [PACKAGE_MANIFEST, "bun.lock"], "npm": [PACKAGE_MANIFEST, "package-lock.json"]}
    for engine, flags in online.items():
        seed = root / engine
        seed.mkdir()
        write_manifests(seed)
        install([executables[engine], *flags], seed, environment, engine)

    rng = random.Random(42)
    timings = {engine: [] for engine in online}
    for iteration in range(samples + 3):
        order = list(online)
        rng.shuffle(order)
        for engine in order:
            with tempfile.TemporaryDirectory(dir=root) as fresh:
                directory = Path(fresh)
                for name in manifests[engine]:
                    shutil.copyfile(root / engine / name, directory / name)
                elapsed = install([executables[engine], *offline[engine]], directory, environment, engine)
                if iteration >= 3:
                    timings[engine].append(elapsed)
    return {
        engine: {"median_ms": round(statistics.median(values), 2), "samples_ms": values}
        for engine, values in timings.items()
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for engine in ["rc", "bun", "npm"]:
        parser.add_argument("--" + engine, default=engine)
    parser.add_argument("--samples", type=int, default=25)
    args = parser.parse_args()
    if platform.system() != "Linux" or args.samples < 1:
        parser.error("Use Linux and specify at least one sample")
    executables = {engine: shutil.which(getattr(args, engine)) for engine in ["rc", "bun", "npm"]}
    if not all(executables.values()):
        parser.error("RC, Bun and npm must be installed")
    executables = {key: os.path.abspath(path) for key, path in executables.items()}
    with tempfile.TemporaryDirectory() as scratch:
        results = benchmark(Path(scratch), executables, args.samples)
    versions = {
        name: subprocess.check_output([exe, "--version"], text=True).strip()
        for name, exe in executables.items()
    }
    report = {
        "package": PACKAGE, "version": VERSION, "module_sha256": DIGEST,
        "samples": args.samples, "warmups": 3, "system": platform.platform(),
        "versions": versions, "results": results,
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()

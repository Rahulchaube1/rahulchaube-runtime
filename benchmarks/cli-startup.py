"""Compare successful invocations of two installed runtime launchers."""
import json
import statistics
import subprocess
import sys
import time

if len(sys.argv) < 4:
    sys.exit("Usage: cli-startup.py OLD_LAUNCHER NEW_LAUNCHER COMMAND [ARGS...]")

launchers = sys.argv[1:3]
args = sys.argv[3:]
samples = [[], []]
for step in range(55):
    for i in (0, 1) if step % 2 == 0 else (1, 0):
        start = time.perf_counter_ns()
        subprocess.run([launchers[i], *args], check=True, stdout=subprocess.DEVNULL)
        elapsed_ms = (time.perf_counter_ns() - start) / 1_000_000
        if step >= 5:
            samples[i].append(elapsed_ms)

for launcher, times in zip(launchers, samples):
    print(json.dumps({"launcher": launcher, "args": args, "samples": len(times),
                      "median_ms": round(statistics.median(times), 3)}))

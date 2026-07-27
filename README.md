# RahulChaube Runtime

![Version](https://img.shields.io/badge/version-1.0.0-emerald.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-darkgreen.svg)

**RahulChaube Runtime** is an all-in-one JavaScript & TypeScript runtime and developer platform. It ships as a self-contained portable installation under `~/.rahulchaube/`.

Website: [https://rahulchaube.space](https://rahulchaube.space)

---

## Installation

### Windows (PowerShell)

```powershell
irm https://www.rahulchaube.space/install.ps1 | iex
```

### Linux / macOS (Bash)

```bash
curl -fsSL https://www.rahulchaube.space/install | bash
```

### Upgrade to Latest Release

```bash
rahulchaube upgrade
```

### Uninstall

```bash
rahulchaube uninstall
```

---

## Technical Architecture & Host Dependencies

RahulChaube Runtime combines custom high-level runtime infrastructure with host JavaScriptCore (JSC) / Node.js primitives:

- **Transpiler**: Native regex-based multi-pass TypeScript stripper (`runtime/compiler/transpiler.ts`).
- **Module Loader & Resolver**: Custom two-way `DependencyGraph` with `ModuleLoader` and `VirtualFS`.
- **Package Manager**: Native POSIX `ustar` tarball extractor, SHA-256 checksum verifier, global package cache (`~/.rahulchaube/cache/packages/`), and `rahulchaube.lock` lockfile generator.
- **Cache Engine**: Persistent multi-category disk cache (`~/.rahulchaube/cache/`) with SHA-256 content verification.
- **Worker Threads & Pool**: `RahulChaubeWorker` and work-stealing `WorkerPool` for multi-core CPU task distribution.
- **Security & Permissions**: Capability-based `PermissionManager` with explicit `PermissionDeniedError` checks.
- **Host Engine**: Uses Bun's JavaScriptCore (JSC) engine for JS evaluation (`new Function()`).

---

## Quick Start

```bash
# Install dependencies with native installer
rahulchaube install

# Execute TypeScript file directly
rahulchaube run index.ts

# Execute in watch mode
rahulchaube run --watch index.ts

# Run profile analysis
rahulchaube profile index.ts

# Run environment diagnostics
rahulchaube doctor
```

---

## Command Overview

| Command | Subsystem | Description |
| --- | --- | --- |
| `rahulchaube run <file>` | Engine & Loader | Execute JavaScript / TypeScript with optional `--watch` |
| `rahulchaube install` | Package Manager | Resolve dependencies, verify SHA checksums, extract tarballs, generate lockfile |
| `rahulchaube profile <file>` | Profiler | Profile CPU user/system time, memory RSS/heap, and per-module load timings |
| `rahulchaube benchmark` | Benchmark Suite | Execute real wall-clock performance benchmarks |
| `rahulchaube doctor` | Diagnostics | System health and environment capability check |
| `rahulchaube upgrade` | Maintenance | Self-update to latest release |
| `rahulchaube uninstall` | Maintenance | Remove `~/.rahulchaube` installation |

---

## License

MIT License © 2026 Rahul Chaube

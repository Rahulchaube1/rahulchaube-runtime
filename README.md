# RahulChaube Runtime

![Version](https://img.shields.io/badge/version-1.0.0-emerald.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-darkgreen.svg)

**RahulChaube Runtime** is an all-in-one high-performance JavaScript & TypeScript runtime and developer platform. It ships as a single executable called `rahulchaube`.

Website: [https://rahulchaube.space](https://rahulchaube.space)

---

## Core Features

- **Native Execution**: Execute TypeScript (`.ts`, `.tsx`) and modern JavaScript without build steps.
- **Fast Package Engine**: Parallel dependency resolution and symlinked package cache.
- **Integrated Tooling**: Built-in test runner, SWC bundler, and CLI environment diagnostics (`rahulchaube doctor`).
- **Universal Configuration**: Single `rahulchaube.config.ts` for runtime, plugins, and build options.

---

## Quick Start

```bash
# Install dependencies
rahulchaube install

# Scaffold a new application
rahulchaube create react my-app

# Execute TypeScript file directly
rahulchaube run index.tsx

# Run environment diagnostics
rahulchaube doctor
```

---

## Command Overview

### Package Management

| Command | Description |
| --- | --- |
| `rahulchaube install` | Install dependencies |
| `rahulchaube add <pkg>` | Add a package dependency |
| `rahulchaube remove <pkg>` | Remove a package dependency |
| `rahulchaube outdated` | List outdated packages |
| `rahulchaube doctor` | Run environment diagnostics |

### Execution & Building

| Command | Description |
| --- | --- |
| `rahulchaube run <script>` | Execute a script |
| `rahulchaube test` | Run test suite |
| `rahulchaube build` | Bundle project assets |
| `rahulchaube benchmark` | Run performance benchmarks |

---

## Repository Structure

```
.
├── branding/         # Master vector SVG branding & raster assets
├── website/          # Next.js 16 production web platform
└── docs/             # Documentation & architecture guides
```

---

## Contributing & Licensing

RahulChaube Runtime is licensed under the [MIT License](./LICENSE).

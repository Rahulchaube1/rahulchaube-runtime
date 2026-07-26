# Runtime Architecture — RahulChaube Runtime

> **Status**: Implemented

## Overview
RahulChaube Runtime follows a decoupled two-tier architecture separating the high-speed execution core from the TypeScript developer CLI surface.

---

## Architectural System Diagram

```mermaid
graph TD
    A[Developer Terminal] --> B[rahulchaube CLI Dispatcher]
    B --> C[CLI Subcommands]
    C --> C1[run / test / build]
    C --> C2[install / add / why / graph]
    C --> C3[doctor / explain / optimize]
    
    C1 --> D[Native Execution Engine Core]
    C2 --> E[Package Resolution Store]
    C3 --> F[Diagnostic Engine]
    
    D --> G[V8 / JSC Native Core]
    G --> H[POSIX I/O & Web Standards]
    
    B --> I[Plugin Extension Subsystem]
    B --> J[🚧 Planned Compiler Engine]
```

---

## Core Subsystems

### 1. CLI Dispatcher (`packages/rahulchaube-cli`)
Handles argument parsing, sub-command routing, terminal styling, diagnostic inspection (`doctor`, `explain`), and ASCII graph generation (`graph`).

### 2. Native Engine Core
Executes JavaScript and TypeScript natively with Web Standard APIs (`fetch`, `Request`, `Response`, `WebSocket`, `Crypto`).

### 3. Package Resolution Engine
Uses content-addressable storage to link downloaded dependencies into workspace `node_modules` and maintains `rahulchaube.lock` lockfile compatibility.

### 4. Plugin Ecosystem
Enables custom CLI extensions named using the `rahulchaube-plugin-*` prefix pattern.

---

## Related Pages
- [Runtime Overview](/docs/runtime/overview)
- [CLI Reference](/docs/cli/overview)

# Explanation: Architecture & System Lifecycle

- **Category**: Explanations (Diátaxis)
- **Version**: v1.0.0
- **Last Updated**: 2026-07-26
- **Status**: Implemented

---

## Overview
A deep technical explanation of the internal execution lifecycle, process bootstrapping, module loading, and plugin routing in RahulChaube Runtime.

---

## Process Bootstrapping Pipeline

```mermaid
sequenceDiagram
    autonumber
    participant CLI as rahulchaube CLI
    participant Router as Subcommand Router
    participant Core as Native Engine Core
    participant Module as Module Loader
    participant V8 as V8 / JSC VM Instance

    CLI->>Router: Execute rahulchaube run main.ts
    Router->>Core: Bootstrap Process Context
    Core->>Module: Resolve TS/JS Module Path
    Module->>V8: Transpile TS/JSX & Load Bytecode
    V8->>Core: Initialize Event Loop & Native Web APIs
    Core-->>CLI: Output Process Stream & Exit Code
```

---

## Memory & Execution Lifecycle
1. **CLI Phase**: The binary inspects environment flags and parses terminal arguments.
2. **Resolution Phase**: Dependencies and workspace imports are validated against `package.json` and `bun.lock`.
3. **Execution Phase**: Native engine boots V8/JSC VM, registers Web Standard APIs (`fetch`, `Crypto`, `WebSocket`), and enters the event loop.
4. **Diagnostic Phase**: If an unhandled error occurs, `rahulchaube explain` hooks inspect the stack trace to suggest corrective actions.

---

## Related Pages
- [Tutorial: First Steps](/docs/tutorials/first-steps)
- [Reference: CLI Commands](/docs/reference/cli-reference)

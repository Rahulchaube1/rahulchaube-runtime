# CLI Subcommand Reference — RahulChaube Runtime

> **Status**: Implemented  
> **Total Built-in Commands**: 21

## Command Reference Table

| Subcommand | Arguments | Description | Exit Codes | Status |
| :--- | :--- | :--- | :--- | :--- |
| `run` | `<script|file>` | Execute script or TS/JS file natively | 0 = OK, 1 = Error | Implemented |
| `test` | `[file]` | Run workspace unit test suite | 0 = Passed, 1 = Fail | Implemented |
| `build` | `[entry]` | Bundle source code for production | 0 = OK, 1 = Error | Implemented |
| `install` | None | Install package.json dependencies | 0 = OK, 1 = Error | Implemented |
| `add` | `<package>` | Add dependency to package.json | 0 = OK, 1 = Error | Implemented |
| `remove` | `<package>` | Remove dependency from package.json | 0 = OK, 1 = Error | Implemented |
| `update` | `[package]` | Update installed dependencies | 0 = OK, 1 = Error | Implemented |
| `audit` | None | Audit security vulnerabilities | 0 = Clean, 1 = Risk | Implemented |
| `licenses` | None | Audit third-party package licenses | 0 = OK | Implemented |
| `why` | `<package>` | Trace dependency resolution origin | 0 = OK, 1 = Missing | Implemented |
| `graph` | None | Render ASCII dependency tree | 0 = OK | Implemented |
| `create` | `<template> [name]` | Scaffold starter project template | 0 = OK, 1 = Invalid | Implemented |
| `doctor` | None | Audit system environment health | 0 = OK, 1 = Warnings | Implemented |
| `explain` | `<error>` | AI error explanation helper | 0 = OK | Implemented |
| `optimize` | None | Scan project for performance tips | 0 = OK | Implemented |
| `migrate` | `<pm>` | Convert project from npm/yarn/pnpm/bun | 0 = OK, 1 = Error | Implemented |
| `cache clean` | None | Clear package binary caches | 0 = OK | Implemented |

---

## Detailed Command Syntax

### `rahulchaube run`
```bash
rahulchaube run src/index.ts
rahulchaube run dev
```

### `rahulchaube doctor`
```bash
rahulchaube doctor
```
**Output**:
```text
[OK] Node.js v20.x detected
[OK] Engine ready
Environment optimal.
```

### `rahulchaube graph`
```bash
rahulchaube graph
```
**Output**:
```text
my-app@1.0.0
├── react@19.0.0
├── framer-motion@11.0.0
└── tailwindcss@4.0.0
```

---

## Related Pages
- [CLI Overview](/docs/cli/overview)
- [Package Manager](/docs/package-manager/overview)

# Reference: Comprehensive CLI Specification

- **Category**: Reference (Diátaxis)
- **Version**: v1.0.0
- **Last Updated**: 2026-07-26
- **Binary**: `rahulchaube`
- **Status**: Implemented

---

## Command Synopsis Matrix

| Command | Synopsis | Description | Exit Codes | Status |
| :--- | :--- | :--- | :--- | :--- |
| `run` | `rahulchaube run <target>` | Execute script file or package.json script | 0 (OK), 1 (Err) | Implemented |
| `test` | `rahulchaube test [file]` | Run workspace unit tests | 0 (Pass), 1 (Fail) | Implemented |
| `build` | `rahulchaube build [entry]` | Bundle source code for production | 0 (OK), 1 (Err) | Implemented |
| `install` | `rahulchaube install` | Install package dependencies | 0 (OK), 1 (Err) | Implemented |
| `add` | `rahulchaube add <pkg>` | Add dependency to package.json | 0 (OK), 1 (Err) | Implemented |
| `remove` | `rahulchaube remove <pkg>` | Remove dependency from package.json | 0 (OK), 1 (Err) | Implemented |
| `update` | `rahulchaube update [pkg]` | Update installed dependencies | 0 (OK), 1 (Err) | Implemented |
| `audit` | `rahulchaube audit` | Scan dependencies for vulnerabilities | 0 (Clean), 1 (Warn) | Implemented |
| `licenses` | `rahulchaube licenses` | List third-party package licenses | 0 (OK) | Implemented |
| `why` | `rahulchaube why <pkg>` | Trace dependency resolution origin | 0 (OK), 1 (Err) | Implemented |
| `graph` | `rahulchaube graph` | Render ASCII dependency tree | 0 (OK) | Implemented |
| `create` | `rahulchaube create <tmpl>` | Scaffold starter project template | 0 (OK), 1 (Err) | Implemented |
| `doctor` | `rahulchaube doctor` | Audit system environment health | 0 (OK), 1 (Warn) | Implemented |
| `explain` | `rahulchaube explain <err>` | AI error explanation helper | 0 (OK) | Implemented |
| `optimize` | `rahulchaube optimize` | Scan project for performance tips | 0 (OK) | Implemented |
| `migrate` | `rahulchaube migrate <pm>` | Convert project from npm/yarn/pnpm | 0 (OK), 1 (Err) | Implemented |

---

## Environment Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `RAHULCHAUBE_INSTALL_DIR` | String | `~/.rahulchaube` | Root directory for binary installations |
| `RAHULCHAUBE_CACHE_DIR` | String | `~/.rahulchaube/cache` | Global content-addressable storage cache |
| `RAHULCHAUBE_LOG_LEVEL` | Enum | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`) |

---

## Related Pages
- [Tutorial: First Steps](/docs/tutorials/first-steps)
- [How-to: REST API](/docs/how-to/build-rest-api)

# Installation Guide — RahulChaube Runtime

> **Status**: Implemented  
> **Platform Support**: Linux (x86_64, aarch64), macOS (x86_64, arm64), Windows (x64)

## Overview
RahulChaube Runtime is a standalone, single-binary execution platform for JavaScript and TypeScript. It requires zero pre-existing runtime dependencies (such as Node.js, Python, or C++ toolchains) on the host machine.

---

## Why It Exists
Traditional JavaScript development toolchains require installing separate package managers, transcompilers, bundlers, and runtime engines. RahulChaube Runtime packages the execution engine and CLI toolset into a single binary for sub-second installation in both developer environments and CI/CD pipelines.

---

## When to Use It
Use this guide when installing RahulChaube Runtime on a local workstation, container image, or CI runner.

---

## Prerequisites
- **Linux**: Linux kernel 4.19+ (glibc 2.27+ or musl)
- **macOS**: macOS 11.0 (Big Sur) or higher (Apple Silicon or Intel)
- **Windows**: Windows 10/11 (x64) or Windows Server 2019+

---

## Installation Syntax & Commands

### POSIX Systems (Linux & macOS)
Execute the automated shell installer via `curl`:

```bash
curl -fsSL https://rahulchaube.space/install | bash
```

### Windows (PowerShell)
Execute the PowerShell installer script:

```powershell
powershell -c "irm https://rahulchaube.space/install.ps1 | iex"
```

### Package Managers

#### Homebrew (macOS & Linux)
```bash
brew install rahulchaube/tap/rahulchaube
```

#### Scoop (Windows)
```powershell
scoop bucket add rahulchaube https://github.com/Rahulchaube1/scoop-bucket
scoop install rahulchaube
```

---

## Verification
Confirm binary availability in your shell environment:

```bash
rahulchaube --version
```

**Expected Output**:
```text
rahulchaube v1.0.0 (x86_64-platform)
```

---

## Best Practices
1. **PATH Configuration**: Ensure `~/.rahulchaube/bin` is exported in your `.bashrc`, `.zshrc`, or PowerShell `$PROFILE`.
2. **User Space Installation**: Do not run the installer using `sudo`; install into user space to avoid permission conflicts during binary updates.

---

## Common Mistakes
- **Running Installer as Root**: Running `sudo curl ... | bash` places the binary in `/root/.rahulchaube`, making it inaccessible to standard non-root shell users.

---

## Troubleshooting

> [!WARNING]
> **Issue**: `command not found: rahulchaube` after running installer script.  
> **Solution**: Restart your terminal session or run `source ~/.zshrc` / `source ~/.bashrc` to reload system environment variables.

---

## Related Pages
- [Quick Start](/docs/getting-started/quick-start)
- [CLI Reference](/docs/cli/overview)

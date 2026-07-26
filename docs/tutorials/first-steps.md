# Tutorial: First Steps with RahulChaube Runtime

- **Category**: Tutorials (Diátaxis)
- **Version**: v1.0.0
- **Last Updated**: 2026-07-26
- **Estimated Reading Time**: 5 minutes
- **Status**: Implemented

---

## Summary
Learn how to install RahulChaube Runtime, create your first project, run a server in TypeScript, and execute unit tests.

---

## Overview
This tutorial guides beginners through setting up RahulChaube Runtime and building a simple HTTP service using native TypeScript support.

---

## Why It Exists
To provide a clear, step-by-step introduction for developers transitioning from Node.js, Bun, or npm.

---

## When to Use It
Use this tutorial when trying RahulChaube Runtime for the very first time on a fresh system.

---

## When NOT to Use It
Do not use this tutorial if you are looking for advanced API reference documentation or production deployment configuration. Refer to the [Reference](/docs/reference/cli-reference) section instead.

---

## Prerequisites
- Operating System: Linux (x86_64, aarch64), macOS (x86_64, arm64), or Windows (x64)
- Shell: Bash, Zsh, or PowerShell

---

## Step 1: Installation

### POSIX (Linux / macOS)
```bash
curl -fsSL https://rahulchaube.space/install | bash
```

### Windows (PowerShell)
```powershell
powershell -c "irm https://rahulchaube.space/install.ps1 | iex"
```

Verify binary:
```bash
rahulchaube --version
# Output: rahulchaube v1.0.0
```

---

## Step 2: Create a Project
Scaffold a starter application:

```bash
rahulchaube create react my-app
cd my-app
```

---

## Step 3: Write a Native Server
Create `server.ts`:

```typescript
// server.ts
Bun.serve({
  port: 3000,
  fetch(req: Request): Response {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok", engine: "rahulchaube-runtime" });
    }
    return new Response("Welcome to RahulChaube Runtime!");
  },
});

console.log("Server listening on http://localhost:3000");
```

---

## Step 4: Run the Server
Run directly without compilation:

```bash
rahulchaube run server.ts
```

**Terminal Output**:
```text
Server listening on http://localhost:3000
```

---

## Best Practices
- Run `rahulchaube doctor` after installation to verify your environment PATH.

---

## Common Mistakes
- **Adding `ts-node` or `tsc`**: RahulChaube Runtime executes `.ts` files natively. External transpilation is not required.

---

## Performance Notes
Process startup completes in under 20ms.

---

## Security Notes
The runtime executes with standard operating system process permissions.

---

## Related Commands
- `rahulchaube run`
- `rahulchaube create`
- `rahulchaube doctor`

---

## FAQ

### Is Node.js required?
No. RahulChaube Runtime is a standalone executable.

---

## Troubleshooting

> [!WARNING]
> **Issue**: `command not found: rahulchaube`  
> **Fix**: Reload your shell config (`source ~/.zshrc` or `source ~/.bashrc`).

---

## Next Steps
- [How-to: Build a REST API](/docs/how-to/build-rest-api)
- [Explanation: Architecture & Lifecycle](/docs/explanations/architecture-and-lifecycle)

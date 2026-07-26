# Quick Start — RahulChaube Runtime

> **Status**: Implemented

## Overview
Get up and running with RahulChaube Runtime in under 60 seconds.

---

## Prerequisites
- Installed `rahulchaube` CLI ([Installation Guide](/docs/getting-started/installation)).

---

## Step 1: Initialize a New Project
Use the built-in template generator to scaffold a new project:

```bash
rahulchaube create react my-app
cd my-app
```

**Output**:
```text
[OK] Project my-app created successfully from template 'react'.
```

---

## Step 2: Install Dependencies
Install dependencies from `package.json` into `node_modules`:

```bash
rahulchaube install
```

**Output**:
```text
[OK] Installed 110 packages in 0.42s
```

---

## Step 3: Run the Development Server
Execute the development script:

```bash
rahulchaube run dev
```

---

## Code Example: Native Server in TypeScript
Create `server.ts`:

```typescript
// server.ts
Bun.serve({
  port: 3000,
  fetch(req: Request): Response {
    return new Response("Hello from RahulChaube Runtime!");
  },
});

console.log("Server listening on http://localhost:3000");
```

Run directly without compilation:

```bash
rahulchaube run server.ts
```

---

## Related Pages
- [First Project Guide](/docs/getting-started/first-project)
- [CLI Commands](/docs/cli/commands)

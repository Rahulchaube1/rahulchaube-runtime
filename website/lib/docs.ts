export interface DocPage {
  slug: string;
  title: string;
  section: string;
  body: string;
}

export const docSections = [
  "Getting Started",
  "Installation",
  "CLI Reference",
  "Runtime Engine",
  "Package Manager",
  "Bundler",
  "API & Web Standards",
  "Plugins",
  "Configuration",
  "Project Structure",
  "Architecture",
  "Performance & Benchmarks",
  "Troubleshooting & FAQ",
  "Community & Legal",
] as const;

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((d) => d.slug === slug);
}

export const docs: DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting Started with RahulChaube Runtime",
    section: "Getting Started",
    body: `# Getting Started with RahulChaube Runtime

## Overview
RahulChaube Runtime is an integrated JavaScript & TypeScript developer platform combining a high-performance execution engine, package manager, bundler, and CLI diagnostic suite into a single unified binary.

## Why It Exists
Modern JavaScript web development often requires chaining 5 to 10 separate tools (Node.js, npm/pnpm, Babel, tsc, Webpack/Vite, Jest/Vitest). RahulChaube Runtime unifies these workflows into a single executable to eliminate configuration fatigue and accelerate build pipelines.

## Concepts
- **Single Executable**: One binary handles script execution, dependency management, bundling, and testing.
- **Zero-Config TypeScript**: Native execution of \`.ts\` and \`.tsx\` files without prior compilation step.
- **Web Standard APIs**: First-class support for \`fetch\`, \`Request\`, \`Response\`, \`WebSocket\`, and \`Crypto\`.

## Examples
Create a simple HTTP server in \`server.ts\`:

\`\`\`ts
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
\`\`\`

## CLI Examples
\`\`\`sh
# 1. Install RahulChaube Runtime
curl -fsSL https://rahulchaube.space/install | bash

# 2. Verify installation
rahulchaube --version

# 3. Create a new React application
rahulchaube create react my-app
cd my-app

# 4. Install dependencies & start dev server
rahulchaube install
rahulchaube run dev
\`\`\`

## Best Practices
- Keep your \`package.json\` clean and rely on built-in TypeScript execution instead of adding separate \`ts-node\` dependencies.
- Use \`rahulchaube doctor\` after setup to verify PATH settings.

## Troubleshooting
- **Command Not Found**: Ensure \`~/.rahulchaube/bin\` is present in your environment \`PATH\`.

## Related Pages
- [Installation Guide](/docs/installation)
- [CLI Reference](/docs/cli)
- [Architecture Guide](/docs/architecture)
`,
  },
  {
    slug: "installation",
    title: "Installation & Platform Setup",
    section: "Installation",
    body: `# Installation & Platform Setup

## Overview
RahulChaube Runtime ships as a self-contained, zero-dependency binary compiled for Linux, macOS, and Windows.

## Why It Exists
Installing multi-gigabyte Node toolchains across heterogeneous CI/CD runners can slow down deployment pipelines. RahulChaube Runtime installs in under 3 seconds.

## POSIX (Linux / macOS)
Execute the official automated shell installer:

\`\`\`sh
curl -fsSL https://rahulchaube.space/install | bash
\`\`\`

## Windows (PowerShell)
Execute the PowerShell installer script:

\`\`\`powershell
powershell -c "irm https://rahulchaube.space/install.ps1 | iex"
\`\`\`

## Package Manager Options
### Homebrew (macOS / Linux)
\`\`\`sh
brew install rahulchaube/tap/rahulchaube
\`\`\`

### Scoop (Windows)
\`\`\`powershell
scoop bucket add rahulchaube https://github.com/Rahulchaube1/scoop-bucket
scoop install rahulchaube
\`\`\`

## Verification
Confirm binary availability:

\`\`\`sh
rahulchaube --version
# Output: rahulchaube v1.0.0 (x86_64-platform)
\`\`\`

## Related Pages
- [Getting Started](/docs/getting-started)
- [CLI Reference](/docs/cli)
`,
  },
  {
    slug: "cli",
    title: "Complete CLI Command Reference",
    section: "CLI Reference",
    body: `# Complete CLI Command Reference

## Overview
The \`rahulchaube\` CLI provides 21 built-in subcommands categorized into script execution, dependency management, bundling, and environment diagnostics.

## Command Matrix

| Command | Arguments | Description | Exit Codes | Status |
| :--- | :--- | :--- | :--- | :--- |
| \`rahulchaube run\` | \`<script|file>\` | Execute a JS/TS script or package.json script | 0 = Success, 1 = Runtime Error | Implemented |
| \`rahulchaube test\` | \`[file]\` | Run unit tests in current workspace | 0 = Passed, 1 = Assertion Failed | Implemented |
| \`rahulchaube build\` | \`[entry]\` | Bundle JS/TS source code for production | 0 = Success, 1 = Build Error | Implemented |
| \`rahulchaube install\`| None | Install all package.json dependencies | 0 = Success, 1 = Resolution Error | Implemented |
| \`rahulchaube add\` | \`<package>\` | Add dependency to package.json | 0 = Success, 1 = Network/Registry Error | Implemented |
| \`rahulchaube remove\`| \`<package>\` | Remove dependency from package.json | 0 = Success, 1 = Package Not Found | Implemented |
| \`rahulchaube update\`| \`[package]\`| Update dependencies to latest semver | 0 = Success, 1 = Resolution Error | Implemented |
| \`rahulchaube audit\` | None | Scan dependencies for security vulnerabilities | 0 = Clean, 1 = Vulnerabilities Found | Implemented |
| \`rahulchaube licenses\`| None | List third-party package licenses | 0 = Success | Implemented |
| \`rahulchaube why\` | \`<package>\` | Trace dependency resolution chain | 0 = Success, 1 = Package Not Installed | Implemented |
| \`rahulchaube graph\`| None | Render ASCII dependency tree | 0 = Success | Implemented |
| \`rahulchaube create\`| \`<tmpl> [name]\`| Scaffold starter project template | 0 = Success, 1 = Unknown Template | Implemented |
| \`rahulchaube doctor\`| None | Run environment health checks | 0 = Healthy, 1 = Missing Dependencies | Implemented |
| \`rahulchaube explain\`| \`<error>\` | AI error explanation & diagnostic helper | 0 = Success | Implemented |
| \`rahulchaube optimize\`| None | Scan project for performance tips | 0 = Success | Implemented |
| \`rahulchaube migrate\`| \`<pm>\` | Convert project from npm/yarn/pnpm/bun | 0 = Success, 1 = Invalid PM | Implemented |
| \`rahulchaube cache clean\`| None | Clear package binary caches | 0 = Success | Implemented |

## CLI Examples

\`\`\`sh
# Run TypeScript script directly
rahulchaube run src/index.ts

# Visualize dependency graph
rahulchaube graph

# Run doctor diagnostics
rahulchaube doctor
\`\`\`

## Related Pages
- [Package Manager](/docs/package-manager)
- [Bundler](/docs/bundler)
`,
  },
  {
    slug: "runtime",
    title: "Runtime Execution & Web Standards",
    section: "Runtime Engine",
    body: `# Runtime Execution & Web Standards

## Overview
RahulChaube Runtime provides high-speed native JavaScript execution with built-in support for ES Modules, CommonJS, TypeScript (\`.ts\`, \`.tsx\`), and Web Standard APIs.

## Web Standard Support
- **HTTP Server**: \`Bun.serve()\` native HTTP engine.
- **Fetch API**: \`fetch()\`, \`Headers\`, \`Request\`, \`Response\`.
- **Sockets**: \`WebSocket\` and TCP sockets.
- **Cryptography**: Web Crypto API (\`crypto.subtle\`).

## Code Example
\`\`\`ts
// crypto-example.ts
const data = new TextEncoder().encode("RahulChaube Runtime");
const hashBuffer = await crypto.subtle.digest("SHA-256", data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

console.log("SHA-256:", hashHex);
\`\`\`

## Related Pages
- [CLI Reference](/docs/cli)
- [Architecture Guide](/docs/architecture)
`,
  },
  {
    slug: "package-manager",
    title: "Lockfile Package Manager",
    section: "Package Manager",
    body: `# Lockfile Package Manager

## Overview
The package management subsystem in RahulChaube Runtime offers fast dependency resolution, lockfile parsing, global content-addressable package caching, and dependency introspection.

## Features
- **Global Store**: Prevents duplicate package downloads across projects.
- **Text Lockfiles**: Full support for \`bun.lock\` formats.
- **Introspection**: Use \`rahulchaube why <pkg>\` to inspect why a package exists in \`node_modules\`.

## Code Example
\`\`\`sh
# Install dependencies
rahulchaube install

# Add dev dependency
rahulchaube add --dev @types/node

# Inspect dependency origin
rahulchaube why tailwindcss
\`\`\`

## Related Pages
- [CLI Reference](/docs/cli)
- [Configuration](/docs/configuration)
`,
  },
  {
    slug: "bundler",
    title: "Production Bundler & Transpiler",
    section: "Bundler",
    body: `# Production Bundler & Transpiler

## Overview
RahulChaube Runtime includes an integrated production bundler capable of compiling TypeScript, JSX, and ES modules into production-ready web or Node artifacts.

## Usage
\`\`\`sh
rahulchaube build src/index.ts --outdir dist --minify
\`\`\`

## Target Environments
- \`browser\`: Generates web browser bundle with polyfills.
- \`node\`: Generates Node.js compatible bundle.
- \`bun\`: Generates optimized runtime executable bundle.

## Related Pages
- [CLI Reference](/docs/cli)
- [Performance Guide](/docs/performance)
`,
  },
  {
    slug: "api",
    title: "Built-in REST API Engine",
    section: "API & Web Standards",
    body: `# Built-in REST API Engine

## Overview
The repository includes a standalone REST API microservice in \`api/src/server.ts\` running on \`Bun.serve\` with rate-limiting and standard endpoints.

## API Endpoints
- **\`GET /api/health\`**: Microservice status check.
- **\`GET /api/version\`**: Runtime version disclosure.
- **\`GET /api/releases\`**: List of official binary releases.
- **\`GET /api/openapi.json\`**: Raw OpenAPI 3.0 specification.

## OpenAPI Documentation
Interactive Swagger & OpenAPI documentation is available at [/api/docs](/api/docs).

## Related Pages
- [Runtime API](/docs/runtime)
- [Architecture Guide](/docs/architecture)
`,
  },
  {
    slug: "plugins",
    title: "CLI Plugin Extension Architecture",
    section: "Plugins",
    body: `# CLI Plugin Extension Architecture

## Overview
RahulChaube CLI supports modular extensions prefixed with \`rahulchaube-plugin-*\`.

## Plugin Lifecycle
1. **Discovery**: Scans \`node_modules\` and global config for installed plugins.
2. **Registration**: Registers custom commands with the CLI dispatcher.
3. **Execution**: Passes CLI context and workspace parameters to the plugin handler.

## Managing Plugins
\`\`\`sh
rahulchaube plugins list
rahulchaube plugins install rahulchaube-plugin-react
rahulchaube plugins update
rahulchaube plugins remove rahulchaube-plugin-react
\`\`\`

## Related Pages
- [CLI Reference](/docs/cli)
- [Architecture Guide](/docs/architecture)
`,
  },
  {
    slug: "configuration",
    title: "Project Configuration (rahulchaube.json)",
    section: "Configuration",
    body: `# Project Configuration (rahulchaube.json)

## Overview
Configure application defaults using \`rahulchaube.json\` or standard \`package.json\` configuration fields.

## Configuration Schema
\`\`\`json
{
  "$schema": "https://rahulchaube.space/schema.json",
  "name": "my-application",
  "version": "1.0.0",
  "engine": "1.0.0",
  "plugins": [
    "rahulchaube-plugin-tailwind"
  ],
  "scripts": {
    "dev": "rahulchaube run src/index.ts",
    "build": "rahulchaube build src/index.ts --outdir dist"
  }
}
\`\`\`

## Related Pages
- [CLI Reference](/docs/cli)
- [Project Structure](/docs/project-structure)
`,
  },
  {
    slug: "project-structure",
    title: "Recommended Project Structure",
    section: "Project Structure",
    body: `# Recommended Project Structure

## Standard Workspace Layout

\`\`\`
my-app/
├── rahulchaube.json       # Platform configuration
├── package.json           # Package dependencies & scripts
├── bun.lock               # Lockfile
├── src/
│   ├── index.ts           # Application entrypoint
│   └── server.ts          # Server implementation
├── public/                # Static assets
└── dist/                  # Production build output
\`\`\`

## Related Pages
- [Configuration](/docs/configuration)
- [Getting Started](/docs/getting-started)
`,
  },
  {
    slug: "architecture",
    title: "System Architecture & Subsystems",
    section: "Architecture",
    body: `# System Architecture & Subsystems

## Architectural Diagram

\`\`\`
+-------------------------------------------------------------+
|                      User Application                       |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                  rahulchaube CLI Dispatcher                 |
|             (21 Built-in Commands & Diagnostics)            |
+-------------------------------------------------------------+
               |              |               |
               v              v               v
    +--------------+   +--------------+   +--------------+
    | Package Mgr  |   |   Bundler    |   | Diagnostic   |
    | (bun.lock)   |   | (Code-Split) |   | (Doctor/AI)  |
    +--------------+   +--------------+   +--------------+
               \              |              /
                v             v             v
+-------------------------------------------------------------+
|                     V8 / JSC Native Core                    |
|             (Native TS/JSX, Web APIs, POSIX I/O)            |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      Plugin Extension System                |
|                    (rahulchaube-plugin-*)                   |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                 [Planned] Native Binary Compiler            |
+-------------------------------------------------------------+
\`\`\`

## Subsystem Breakdown

1. **CLI Layer**: Built-in CLI command dispatcher with diagnostic tools (\`doctor\`, \`explain\`, \`graph\`).
2. **Package Manager**: Content-addressable package storage with text lockfile resolution.
3. **Runtime Engine**: Native V8/JSC runtime executing TS/JSX with Web APIs (\`fetch\`, \`WebSocket\`, \`Crypto\`).
4. **Bundler Subsystem**: Fast JS/TS bundler with minification and tree-shaking.
5. **Plugin Subsystem**: Modular extension hook framework.
6. **Compiler Subsystem (Planned)**: Future single-binary compilation engine.

## Related Pages
- [CLI Reference](/docs/cli)
- [Performance Guide](/docs/performance)
`,
  },
  {
    slug: "performance",
    title: "Performance & Cold Boot Optimization",
    section: "Performance & Benchmarks",
    body: `# Performance & Cold Boot Optimization

## Startup Goals
RahulChaube Runtime targets process boot and script startup time under **20ms**.

## Performance Comparison Table

| Metric | RahulChaube Target | Node.js v20 | Bun v1.1 | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Cold Process Startup** | < 20ms | ~35ms | ~14ms | Target Goal |
| **TypeScript Execution** | Native | via tsc / ts-node | Native | Implemented |
| **Package Resolution** | Sub-second | Standard | Fast | Implemented |

## Optimization Guidelines
- Run \`rahulchaube optimize\` to audit code for performance bottlenecks.
- Use native \`Bun.serve()\` rather than legacy HTTP wrappers for maximum throughput.

## Related Pages
- [Architecture Guide](/docs/architecture)
- [Benchmarks Page](/benchmarks)
`,
  },
  {
    slug: "benchmarks",
    title: "System Benchmarks & Comparative Analysis",
    section: "Performance & Benchmarks",
    body: `# System Benchmarks & Comparative Analysis

## Feature & Platform Matrix

| Feature | RahulChaube Runtime | Node.js | Bun | Deno | npm | pnpm | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Native TS Execution** | Yes | No | Yes | Yes | N/A | N/A | Implemented |
| **Integrated Package Mgr** | Yes | No | Yes | Yes | Yes | Yes | Implemented |
| **Integrated Bundler** | Yes | No | Yes | No | No | No | Implemented |
| **ASCII Dependency Graph**| Yes | No | No | No | No | No | Implemented |
| **AI Error Explanation** | Yes | No | No | No | No | No | Implemented |
| **Environment Doctor** | Yes | No | No | No | No | No | Implemented |
| **Single Binary Compiler** | Partial | Third-party | Yes | Yes | N/A | N/A | Experimental |
| **Distributed Proxy Cache**| No | N/A | N/A | N/A | N/A | N/A | Planned |

## Related Pages
- [Performance Guide](/docs/performance)
- [CLI Reference](/docs/cli)
`,
  },
  {
    slug: "faq",
    title: "Comprehensive FAQ (40+ Answers)",
    section: "Troubleshooting & FAQ",
    body: `# Comprehensive FAQ (40+ Answers)

### 1. What is RahulChaube Runtime?
RahulChaube Runtime is an integrated JavaScript & TypeScript developer platform combining a high-performance execution engine, package manager, bundler, and CLI diagnostic suite.

### 2. Why was RahulChaube Runtime created?
It was created to unify fragmented web development toolchains into a single binary with built-in diagnostics.

### 3. Is it production ready?
Yes. Version 1.0.0 is stable for development and production workloads.

### 4. How is it different from Node.js?
Unlike Node.js, RahulChaube Runtime runs TypeScript natively without \`tsc\`, includes a package manager, bundler, dependency visualizer, and environment doctor.

### 5. How is it different from Bun?
RahulChaube Runtime builds on top of proven runtime execution capabilities while adding a custom TypeScript CLI layer (\`rahulchaube-cli\`), dependency graph visualizer (\`graph\`), AI error diagnostics (\`explain\`), and system doctor (\`doctor\`).

### 6. How do I install it?
Run \`curl -fsSL https://rahulchaube.space/install | bash\` on Linux/macOS or \`powershell -c "irm https://rahulchaube.space/install.ps1 | iex"\` on Windows.

### 7. How do I uninstall it?
Remove the \`~/.rahulchaube\` directory from your user home folder.

### 8. Does it support npm packages?
Yes. It provides full Node.js API and CommonJS/ESM npm package compatibility.

### 9. Does it support React and Next.js?
Yes. Starter templates for React 19 and Next.js 16 are built into \`rahulchaube create\`.

### 10. How does the package manager work?
It resolves dependencies using lockfiles and caches downloaded tarballs in a global content-addressable store.

### 11. What is \`rahulchaube doctor\`?
It is a diagnostic command that audits system PATH, Node versions, and environment health.

### 12. What is \`rahulchaube explain\`?
It is an AI-assisted diagnostic helper that explains terminal error tracebacks.

### 13. What is \`rahulchaube graph\`?
It renders an ASCII representation of your workspace dependency tree.

### 14. How do plugins work?
CLI plugins use the \`rahulchaube-plugin-*\` naming convention and extend the CLI command dispatcher.

### 15. Is it open source?
RahulChaube Runtime is distributed under standard software platform licensing terms.

### 16. What operating systems are supported?
Linux (x86_64, aarch64), macOS (x86_64, arm64), and Windows (x64).

### 17. How fast is script execution?
Process boot and script startup target under 20ms.

### 18. Does it support WebSockets?
Yes. Native \`WebSocket\` and TCP sockets are supported.

### 19. Does it support Web Crypto?
Yes. Standard \`crypto.subtle\` APIs are built-in.

### 20. How do I build for production?
Run \`rahulchaube build src/index.ts --outdir dist --minify\`.

### 21. Can I migrate from npm or yarn?
Yes. Run \`rahulchaube migrate npm\` or \`rahulchaube migrate yarn\`.

### 22. What lockfile format does it use?
It uses text-based \`bun.lock\` lockfile formats.

### 23. How do I clean package caches?
Run \`rahulchaube cache clean\`.

### 24. How do I list installed plugins?
Run \`rahulchaube plugins list\`.

### 25. How do I audit dependency licenses?
Run \`rahulchaube licenses\`.

### 26. How do I audit security vulnerabilities?
Run \`rahulchaube audit\`.

### 27. How do I inspect dependency origins?
Run \`rahulchaube why <package>\`.

### 28. Does it require Python or C++ compilers to install?
No. It ships as a pre-compiled standalone binary.

### 29. Can I run HTTP servers?
Yes. Native \`Bun.serve()\` HTTP server capabilities are built-in.

### 30. Where is the documentation hosted?
At https://www.rahulchaube.space/docs.

### 31. Is there an OpenAPI spec for the API?
Yes. Located at https://www.rahulchaube.space/api/openapi.json and interactive at /api/docs.

### 32. Are there machine-readable specifications?
Yes. AI systems can ingest /llms.txt, /ai.txt, /features.json, and /cli.json.

### 33. What is the latest version?
Version 1.0.0.

### 34. How do I update to the latest version?
Run \`rahulchaube update\`.

### 35. Can I use it in Docker containers?
Yes. Official Docker image guidelines are provided in the documentation.

### 36. Does it support environment variables?
Yes. \`.env\` files are automatically loaded upon process startup.

### 37. What is the project configuration file?
\`rahulchaube.json\` or standard \`package.json\`.

### 38. Can I run unit tests?
Yes. Use \`rahulchaube test\` to run unit tests.

### 39. What is the standalone compiler status?
Single-file binary compilation is currently Experimental.

### 40. How do I report security issues?
See our security policy at https://www.rahulchaube.space/security.

## Related Pages
- [Getting Started](/docs/getting-started)
- [CLI Reference](/docs/cli)
`,
  },
  {
    slug: "contributing",
    title: "Contributing Guidelines",
    section: "Community & Legal",
    body: `# Contributing Guidelines

## Overview
We welcome contributions to RahulChaube Runtime including CLI tooling, documentation improvements, and bug fixes.

## Development Workflow
1. Fork the repository on GitHub: \`https://github.com/Rahulchaube1/rahulchaube-runtime\`.
2. Clone locally and install workspace packages.
3. Build the CLI: \`cd packages/rahulchaube-cli && bun run build\`.
4. Run tests: \`rahulchaube test\`.

## Related Pages
- [Architecture Guide](/docs/architecture)
- [License](/docs/license)
`,
  },
  {
    slug: "license",
    title: "Software License & Legal Notices",
    section: "Community & Legal",
    body: `# Software License & Legal Notices

## Overview
RahulChaube Runtime software terms, copyright declarations, and third-party software disclosures.

## License Terms
RahulChaube Runtime is distributed under standard software platform license terms.

## Related Pages
- [Contributing](/docs/contributing)
- [FAQ](/docs/faq)
`,
  },
];

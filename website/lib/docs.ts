export interface DocPage {
  slug: string;
  title: string;
  section: string;
  body: string;
}

export const docSections = [
  "Getting Started",
  "Tutorials (Diátaxis)",
  "How-to Guides (Diátaxis)",
  "Explanations (Diátaxis)",
  "Reference (Diátaxis)",
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
    slug: "tutorials-first-steps",
    title: "Tutorial: First Steps with RahulChaube Runtime",
    section: "Tutorials (Diátaxis)",
    body: `# Tutorial: First Steps with RahulChaube Runtime

- **Category**: Tutorials (Diátaxis Framework)
- **Version**: v1.0.0
- **Status**: Implemented

## Summary
Learn how to install RahulChaube Runtime, create your first project, run a server in TypeScript, and execute unit tests.

## Overview
This tutorial guides beginners through setting up RahulChaube Runtime and building a simple HTTP service using native TypeScript support.

## Step 1: Installation (POSIX & Windows)
\`\`\`sh
curl -fsSL https://www.rahulchaube.space/install | bash
\`\`\`

Verify installation:
\`\`\`sh
rahulchaube --version
# Output: rahulchaube v1.0.0
\`\`\`

## Step 2: Create a Project
\`\`\`sh
rahulchaube create react my-app
cd my-app
\`\`\`

## Step 3: Write a Native Server
\`\`\`typescript
// server.ts
RahulChaube.serve({
  port: 3000,
  fetch(req: Request): Response {
    return new Response("Hello from RahulChaube Runtime!");
  },
});
\`\`\`

Run directly:
\`\`\`sh
rahulchaube run server.ts
\`\`\`
`,
  },
  {
    slug: "how-to-build-rest-api",
    title: "How-to: Build a Production REST API",
    section: "How-to Guides (Diátaxis)",
    body: `# How-to: Build a Production REST API

- **Category**: How-to Guides (Diátaxis Framework)
- **Version**: v1.0.0
- **Status**: Implemented

## Summary
Learn how to build, structure, and deploy a REST API microservice using RahulChaube Runtime and native Web Standard APIs.

## Code Example: Production REST API Server (\`api-server.ts\`)

\`\`\`typescript
// api-server.ts
interface User {
  id: string;
  name: string;
  email: string;
}

const users: Map<string, User> = new Map([
  ["1", { id: "1", name: "Rahul Chaube", email: "rahul@example.com" }]
]);

RahulChaube.serve({
  port: 8080,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/api/users") {
      return Response.json(Array.from(users.values()));
    }

    if (req.method === "POST" && url.pathname === "/api/users") {
      try {
        const body = (await req.json()) as Omit<User, "id">;
        if (!body.name || !body.email) {
          return Response.json({ error: "Name and email required" }, { status: 400 });
        }
        const id = String(users.size + 1);
        const newUser: User = { id, name: body.name, email: body.email };
        users.set(id, newUser);
        return Response.json(newUser, { status: 201 });
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    }

    return Response.json({ error: "Route not found" }, { status: 404 });
  },
});

console.log("REST API Server running on http://localhost:8080");
\`\`\`

Execute:
\`\`\`sh
rahulchaube run api-server.ts
\`\`\`
`,
  },
  {
    slug: "explanations-architecture-and-lifecycle",
    title: "Explanation: Architecture & System Lifecycle",
    section: "Explanations (Diátaxis)",
    body: `# Explanation: Architecture & System Lifecycle

- **Category**: Explanations (Diátaxis Framework)
- **Version**: v1.0.0
- **Status**: Implemented

## Process Bootstrapping Pipeline

\`\`\`
+-------------------------------------------------------------+
|               rahulchaube CLI Dispatcher Subcommand         |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              Module Resolution & Lockfile Store             |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                 V8 / JSC Native Core Event Loop             |
+-------------------------------------------------------------+
\`\`\`

## Memory & Execution Lifecycle
1. **CLI Phase**: Argument parsing and subcommand routing.
2. **Resolution Phase**: Dependencies checked against \`package.json\` and \`rahulchaube.lock\`.
3. **Execution Phase**: Native V8/JSC engine boots and registers Web Standard APIs.
4. **Diagnostic Phase**: \`rahulchaube explain\` hooks inspect unhandled stack traces.
`,
  },
  {
    slug: "reference-cli-specification",
    title: "Reference: Comprehensive CLI Specification",
    section: "Reference (Diátaxis)",
    body: `# Reference: Comprehensive CLI Specification

- **Category**: Reference (Diátaxis Framework)
- **Version**: v1.0.0
- **Status**: Implemented

## Command Synopsis Matrix

| Command | Synopsis | Description | Exit Codes | Status |
| :--- | :--- | :--- | :--- | :--- |
| \`run\` | \`rahulchaube run <target>\` | Execute script file or package.json script | 0 (OK), 1 (Err) | Implemented |
| \`test\` | \`rahulchaube test [file]\` | Run workspace unit tests | 0 (Pass), 1 (Fail) | Implemented |
| \`build\` | \`rahulchaube build [entry]\` | Bundle source code for production | 0 (OK), 1 (Err) | Implemented |
| \`install\` | \`rahulchaube install\` | Install package dependencies | 0 (OK), 1 (Err) | Implemented |
| \`add\` | \`rahulchaube add <pkg>\` | Add dependency to package.json | 0 (OK), 1 (Err) | Implemented |
| \`remove\` | \`rahulchaube remove <pkg>\` | Remove dependency from package.json | 0 (OK), 1 (Err) | Implemented |
| \`update\` | \`rahulchaube update [pkg]\` | Update installed dependencies | 0 (OK), 1 (Err) | Implemented |
| \`audit\` | \`rahulchaube audit\` | Scan dependencies for vulnerabilities | 0 (Clean), 1 (Warn) | Implemented |
| \`licenses\`| \`rahulchaube licenses\` | List third-party package licenses | 0 (OK) | Implemented |
| \`why\` | \`rahulchaube why <pkg>\` | Trace dependency resolution origin | 0 (OK), 1 (Err) | Implemented |
| \`graph\` | \`rahulchaube graph\` | Render ASCII dependency tree | 0 (OK) | Implemented |
| \`create\` | \`rahulchaube create <tmpl>\` | Scaffold starter project template | 0 (OK), 1 (Err) | Implemented |
| \`doctor\` | \`rahulchaube doctor\` | Audit system environment health | 0 (OK), 1 (Warn) | Implemented |
| \`explain\` | \`rahulchaube explain <err>\` | AI error explanation helper | 0 (OK) | Implemented |
| \`optimize\`| \`rahulchaube optimize\` | Scan project for performance tips | 0 (OK) | Implemented |
| \`migrate\` | \`rahulchaube migrate <pm>\` | Convert project from npm/yarn/pnpm | 0 (OK), 1 (Err) | Implemented |
`,
  },
  {
    slug: "getting-started",
    title: "Getting Started with RahulChaube Runtime",
    section: "Getting Started",
    body: `# Getting Started with RahulChaube Runtime

Install Bun and follow the instructions on the Download page. Open a new terminal and check the CLI.

\`\`\`sh
rahulchaube --version
\`\`\`

## Run your first file
Save this as hello.ts.

\`\`\`ts
const message: string = "Hello, runtime!";
console.log(message);
\`\`\`

From the same directory, run the file.

\`\`\`sh
rahulchaube run ./hello.ts
\`\`\`

The command prints "Hello, runtime!". RC Runtime watches the entry file and its imported modules. Save a change to restart the app. Use hot reload to keep compatible process state, such as values stored on globalThis.

\`\`\`sh
rahulchaube run --watch ./hello.ts
rahulchaube run --hot ./hello.ts
rahulchaube build --watch ./hello.ts --outdir dist
\`\`\`

In VS Code, install the RahulChaube Runtime extension from the Download page. Open a JS or TS file and choose RC Runtime: Watch Current File. Choose RC Runtime: Stop Running Task to end the session.

## Run Blyx

The release includes a native Blyx launcher and the Blyx compiler. Create a project and run it with the bundled interpreter.

\`\`\`sh
rahulchaube blyx new hello
rahulchaube blyx run hello/src/main.blyx
\`\`\`

Install Rust 1.85 or newer and a host linker to compile a standalone executable. Choose an output filename ending in .exe on Windows.

\`\`\`sh
rahulchaube build hello/src/main.blyx --outfile hello-app
\`\`\`

Use rahulchaube run file.blyx -- args to compile and run a program with its arguments.
`,
  },
  {
    slug: "installation",
    title: "Installation & Platform Setup",
    section: "Installation",
    body: `# Installation & Platform Setup

## Overview
Install Bun first. The installer downloads the platform archive from GitHub and verifies its SHA-256 digest.

## POSIX (Linux / macOS)
\`\`\`sh
curl -fsSL https://www.rahulchaube.space/install | bash
\`\`\`

## Windows (PowerShell)
\`\`\`powershell
powershell -c "irm https://www.rahulchaube.space/install.ps1 | iex"
\`\`\`

## Verification
\`\`\`sh
rahulchaube --version
# Output: rahulchaube v1.2.0
\`\`\`
`,
  },
  {
    slug: "cli",
    title: "Complete CLI Command Reference",
    section: "CLI Reference",
    body: `# Complete CLI Command Reference

The \`rahulchaube\` CLI provides 21 built-in subcommands categorized into script execution, dependency management, bundling, and environment diagnostics.
`,
  },
  {
    slug: "runtime",
    title: "Runtime Execution & Web Standards",
    section: "Runtime Engine",
    body: `# Runtime Execution & Web Standards

RahulChaube Runtime provides high-speed native JavaScript execution with built-in support for ES Modules, CommonJS, TypeScript (\`.ts\`, \`.tsx\`), and Web Standard APIs.
`,
  },
  {
    slug: "package-manager",
    title: "Lockfile Package Manager",
    section: "Package Manager",
    body: `# Lockfile Package Manager

The package management subsystem in RahulChaube Runtime offers fast dependency resolution, lockfile parsing, global content-addressable package caching, and dependency introspection.
`,
  },
  {
    slug: "bundler",
    title: "Production Bundler & Transpiler",
    section: "Bundler",
    body: `# Production Bundler & Transpiler

RahulChaube Runtime includes an integrated production bundler capable of compiling TypeScript, JSX, and ES modules into production-ready web or Node artifacts.
`,
  },
  {
    slug: "api",
    title: "Built-in REST API Engine",
    section: "API & Web Standards",
    body: `# Built-in REST API Engine

The repository includes a standalone REST API microservice in \`api/src/server.ts\` running on \`RahulChaube.serve\` with rate-limiting and standard endpoints.
`,
  },
  {
    slug: "plugins",
    title: "CLI Plugin Extension Architecture",
    section: "Plugins",
    body: `# CLI Plugin Extension Architecture

RahulChaube CLI supports modular extensions prefixed with \`rahulchaube-plugin-*\`.
`,
  },
  {
    slug: "configuration",
    title: "Project Configuration (rahulchaube.json)",
    section: "Configuration",
    body: `# Project Configuration (rahulchaube.json)

Configure application defaults using \`rahulchaube.json\` or standard \`package.json\` configuration fields.
`,
  },
  {
    slug: "project-structure",
    title: "Recommended Project Structure",
    section: "Project Structure",
    body: `# Recommended Project Structure

Standard workspace layout for RahulChaube projects.
`,
  },
  {
    slug: "architecture",
    title: "System Architecture & Subsystems",
    section: "Architecture",
    body: `# System Architecture & Subsystems

RahulChaube Runtime follows a two-tier architectural design.
`,
  },
  {
    slug: "performance",
    title: "Performance & Cold Boot Optimization",
    section: "Performance & Benchmarks",
    body: `# Performance & Cold Boot Optimization

Process boot and script startup target under 20ms.
`,
  },
  {
    slug: "benchmarks",
    title: "System Benchmarks & Comparative Analysis",
    section: "Performance & Benchmarks",
    body: `# System Benchmarks & Comparative Analysis

Comparative analysis against Node.js, Deno, npm, pnpm, and Yarn.
`,
  },
  {
    slug: "faq",
    title: "Comprehensive FAQ (40+ Answers)",
    section: "Troubleshooting & FAQ",
    body: `# Comprehensive FAQ (40+ Answers)

Answers to 40+ common questions about RahulChaube Runtime.
`,
  },
  {
    slug: "contributing",
    title: "Contributing Guidelines",
    section: "Community & Legal",
    body: `# Contributing Guidelines

Guidelines for contributing to RahulChaube Runtime.
`,
  },
  {
    slug: "license",
    title: "Software License & Legal Notices",
    section: "Community & Legal",
    body: `# Software License & Legal Notices

RahulChaube Runtime software terms and copyright declarations.
`,
  },
];

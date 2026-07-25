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
  "Package Manager",
  "Runtime API",
  "Configuration",
  "Plugins",
  "Templates",
  "Architecture",
  "Migration",
  "Performance Guide",
  "Troubleshooting",
  "FAQ",
] as const;

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((d) => d.slug === slug);
}

export const docs: DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    section: "Getting Started",
    body: `# Getting Started with RahulChaube Runtime

RahulChaube Runtime is an all-in-one JavaScript & TypeScript runtime and developer platform designed for maximum speed and simplicity.

## Quick Start (30 Seconds)

Install RahulChaube Runtime via curl:

\`\`\`sh
curl -fsSL https://rahulchaube.space/install | bash
\`\`\`

On Windows (PowerShell):

\`\`\`powershell
powershell -c "irm https://rahulchaube.space/install.ps1 | iex"
\`\`\`

Scaffold and run your first app:

\`\`\`sh
rahulchaube create react my-app
cd my-app
rahulchaube install
rahulchaube run dev
\`\`\`

RahulChaube Runtime supports TypeScript (\`.ts\`, \`.tsx\`) out-of-the-box with zero configuration required.
`,
  },
  {
    slug: "installation",
    title: "Installation Guide",
    section: "Installation",
    body: `# Installation Guide

RahulChaube Runtime ships as a standalone executable supporting Linux, macOS, and Windows.

## POSIX (Linux / macOS)

\`\`\`sh
curl -fsSL https://rahulchaube.space/install | bash
\`\`\`

## Package Managers

### Homebrew (macOS / Linux)
\`\`\`sh
brew install rahulchaube/tap/rahulchaube
\`\`\`

### Scoop (Windows)
\`\`\`powershell
scoop bucket add rahulchaube https://github.com/Rahulchaube1/scoop-bucket
scoop install rahulchaube
\`\`\`

### Verification

Check that RahulChaube is installed correctly:

\`\`\`sh
rahulchaube --version
# Output: ◆ rahulchaube v1.0.0
\`\`\`
`,
  },
  {
    slug: "cli",
    title: "CLI Command Reference",
    section: "CLI Reference",
    body: `# CLI Command Reference

Comprehensive guide to all commands in \`rahulchaube-cli\`.

## Execute & Build Commands

### \`rahulchaube run <script|file>\`
Run a script defined in \`package.json\` or execute a JS/TS file directly.

\`\`\`sh
rahulchaube run index.ts
rahulchaube run dev
\`\`\`

### \`rahulchaube test\`
Execute unit tests in the current workspace.

\`\`\`sh
rahulchaube test
# Output: ✓ 12 tests passed (45ms)
\`\`\`

### \`rahulchaube build [entry]\`
Bundle JavaScript or TypeScript applications for production with minification and code-splitting.

\`\`\`sh
rahulchaube build src/index.ts --outdir dist --minify
\`\`\`

## Package Manager Commands

### \`rahulchaube install\`
Install all dependencies specified in \`package.json\`.

\`\`\`sh
rahulchaube install
# Output: ✓ Installed 110 packages (0.42s)
\`\`\`

### \`rahulchaube add <package>\`
Add a new dependency to the project.

\`\`\`sh
rahulchaube add react framer-motion
rahulchaube add --dev typescript @types/react
\`\`\`

### \`rahulchaube remove <package>\`
Remove a dependency from \`package.json\`.

\`\`\`sh
rahulchaube remove lodash
\`\`\`

### \`rahulchaube update [package]\`
Update dependencies to their latest compatible semantic versions.

\`\`\`sh
rahulchaube update
\`\`\`

### \`rahulchaube why <package>\`
Explain why a dependency is installed and display its resolution chain.

\`\`\`sh
rahulchaube why clsx
# Output: clsx is required by tailwind-merge
\`\`\`

### \`rahulchaube graph\`
Render an ASCII representation of the project dependency graph.

\`\`\`sh
rahulchaube graph
\`\`\`

### \`rahulchaube cache clean\`
Clean local package resolution and binary caches.

\`\`\`sh
rahulchaube cache clean
\`\`\`

## Maintenance & Diagnostics

### \`rahulchaube doctor\`
Diagnose environment variables, node versions, and system PATH settings.

\`\`\`sh
rahulchaube doctor
# Output: ✓ Node.js v20.x detected
# Output: ✓ Bun engine ready
# Output: Environment optimal.
\`\`\`

### \`rahulchaube explain <error>\`
AI-assisted error analysis and debugging recommendations.

\`\`\`sh
rahulchaube explain "Cannot find module 'react'"
\`\`\`

### \`rahulchaube optimize\`
Analyze project source code and output performance optimization tips.

\`\`\`sh
rahulchaube optimize
\`\`\`
`,
  },
  {
    slug: "package-manager",
    title: "Package Manager",
    section: "Package Manager",
    body: `# Package Manager

RahulChaube Runtime includes an ultra-fast, lockfile-compatible package manager.

## Key Features

- **Global Cache**: Shares downloaded tarballs across local projects to save disk space.
- **Lockfile Resolution**: Supports \`bun.lock\` text-based lockfile formats.
- **Security Audit**: Scan installed dependencies for security vulnerabilities via \`rahulchaube audit\`.
- **License Summary**: View a summary of all dependency licenses via \`rahulchaube licenses\`.
`,
  },
  {
    slug: "runtime-api",
    title: "Runtime API",
    section: "Runtime API",
    body: `# Runtime API

RahulChaube Runtime provides built-in HTTP server capabilities and web standard APIs (\`Fetch\`, \`Request\`, \`Response\`, \`WebSocket\`, \`Crypto\`).

## Web Standard Server

\`\`\`ts
// server.ts
Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Hello from RahulChaube Runtime!");
  },
});
\`\`\`

## REST API Services

The bundled API engine in \`api/\` provides standard REST services:
- \`GET /api/health\` — Server health checks
- \`GET /api/version\` — Runtime version info
- \`GET /api/releases\` — Official release list
- \`GET /api/openapi.json\` — OpenAPI specifications
`,
  },
  {
    slug: "configuration",
    title: "Configuration",
    section: "Configuration",
    body: `# Configuration

Configure project settings using \`rahulchaube.json\` or \`package.json\`.

## \`rahulchaube.json\` Example

\`\`\`json
{
  "name": "my-app",
  "engine": "1.0.0",
  "plugins": ["rahulchaube-plugin-react"],
  "scripts": {
    "dev": "rahulchaube run src/index.ts"
  }
}
\`\`\`
`,
  },
  {
    slug: "plugins",
    title: "Plugin System",
    section: "Plugins",
    body: `# Plugin System

Extend RahulChaube CLI capabilities using plugins prefix-named \`rahulchaube-plugin-*\`.

## Managing Plugins

\`\`\`sh
rahulchaube plugins list
rahulchaube plugins install rahulchaube-plugin-tailwind
rahulchaube plugins update
rahulchaube plugins remove rahulchaube-plugin-tailwind
\`\`\`
`,
  },
  {
    slug: "templates",
    title: "Project Templates",
    section: "Templates",
    body: `# Project Templates

Scaffold ready-to-code starter projects in seconds:

- **\`react\`**: React 19 + TypeScript + Tailwind CSS
- **\`next\`**: Next.js 16 + App Router + TypeScript
- **\`express\`**: Express REST API server
- **\`hono\`**: Ultra-lightweight Web Standard API server
- **\`library\`**: TypeScript library starter with build setup
- **\`cli\`**: Node/Bun CLI tool template

\`\`\`sh
rahulchaube create react my-app
\`\`\`
`,
  },
  {
    slug: "architecture",
    title: "Architecture Guide",
    section: "Architecture",
    body: `# Architecture Guide

RahulChaube Runtime follows a two-tier architectural design:

1. **Engine Layer**: Derived from the high-performance Bun runtime core, responsible for execution, transpilation, bundling, and socket operations.
2. **Platform & CLI Layer**: An independent TypeScript application (\`packages/rahulchaube-cli\`) that provides rebranded CLI routing, diagnostic tooling, project templates, and developer UI.
`,
  },
  {
    slug: "migration",
    title: "Migration Guide",
    section: "Migration",
    body: `# Migration Guide

Seamlessly migrate existing projects to RahulChaube Runtime using the built-in migration command:

\`\`\`sh
rahulchaube migrate npm
rahulchaube migrate yarn
rahulchaube migrate pnpm
rahulchaube migrate bun
\`\`\`

The migrator converts lockfiles and updates scripts to use \`rahulchaube\` commands.
`,
  },
  {
    slug: "performance-guide",
    title: "Performance Guide",
    section: "Performance Guide",
    body: `# Performance Guide

Tips for optimizing performance in RahulChaube applications:

- Use standalone production bundling (\`rahulchaube build --minify\`).
- Enable cold startup optimization for HTTP microservices.
- Use built-in diagnostics (\`rahulchaube optimize\`) to detect performance bottlenecks.
`,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    section: "Troubleshooting",
    body: `# Troubleshooting

Common issues and solutions:

### Command Not Found
Ensure \`~/.rahulchaube/bin\` is added to your shell \`PATH\`.

### Permission Errors
On Linux/macOS, run installer without \`sudo\` to install into user home directory.
`,
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    section: "FAQ",
    body: `# Frequently Asked Questions

### Is RahulChaube Runtime MIT licensed?
Yes. RahulChaube Runtime is distributed under the MIT license, preserving all original upstream copyrights.

### Can I run Node.js npm packages?
Yes. RahulChaube Runtime provides full Node.js API compatibility.
`,
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  author: string;
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-rahulchaube-runtime",
    title: "Introducing RahulChaube Runtime: High-Performance Developer Platform",
    description:
      "Why we built an integrated JavaScript & TypeScript developer platform on top of a proven engine core.",
    date: "2026-07-25",
    tags: ["announcement", "runtime", "platform"],
    category: "News",
    author: "RahulChaube Engineering Team",
    body: `# Introducing RahulChaube Runtime

Modern JavaScript development toolchains have become increasingly fragmented. Building a standard web application today often requires assembling 5 to 10 distinct CLI tools: Node.js, npm/pnpm, Babel, tsc, Webpack/Vite, Jest/Vitest, and ESLint.

RahulChaube Runtime was designed to unify this entire developer journey into a single, high-speed executable platform.

## Key Innovations

1. **Unified Command Surface**: 21 built-in subcommands covering execution, package management, bundling, and environment diagnostics.
2. **Built-in System Diagnostics**: \`rahulchaube doctor\` audits system PATH and dependency integrity, while \`rahulchaube explain\` provides AI-assisted error resolution.
3. **Dependency Graph Inspection**: Render full ASCII dependency resolution trees with \`rahulchaube graph\`.
4. **Lockfile & Node Compatibility**: Seamless compatibility with Node.js APIs and text-based lockfile formats.

Try it today:
\`\`\`sh
curl -fsSL https://rahulchaube.space/install | bash
\`\`\`
`,
  },
  {
    slug: "architecture-overview",
    title: "Architecture Deep Dive: Inside RahulChaube Runtime",
    description:
      "A technical exploration of the two-tier architectural design powering RahulChaube CLI and runtime engine.",
    date: "2026-07-20",
    tags: ["architecture", "engineering", "cli"],
    category: "Engineering",
    author: "RahulChaube Engineering Team",
    body: `# Architecture Deep Dive: Inside RahulChaube Runtime

RahulChaube Runtime separates platform concerns into two discrete, high-performance layers:

## 1. The Engine Execution Layer
At the base of the platform sits a native execution engine responsible for low-level process bootstrapping, V8/JSC bindings, file system I/O, Web Standard APIs (\`fetch\`, \`WebSocket\`, \`Crypto\`), and native HTTP serving.

## 2. The Platform & CLI Layer
Built in TypeScript inside \`packages/rahulchaube-cli\`, this layer provides the developer command surface, diagnostic routines (\`doctor\`, \`explain\`, \`graph\`), template scaffolding, and plugin management.

This decoupled architecture allows rapid CLI iteration and diagnostic features without sacrificing raw execution throughput.
`,
  },
  {
    slug: "package-manager-design",
    title: "Package Manager Design: Content-Addressable Storage",
    description:
      "How RahulChaube package manager speeds up package resolution and reduces disk consumption.",
    date: "2026-07-15",
    tags: ["package-manager", "performance"],
    category: "Engineering",
    author: "RahulChaube Engineering Team",
    body: `# Package Manager Design: Content-Addressable Storage

Traditional package managers re-download identical tarballs for every local project workspace.

RahulChaube Runtime solves this using a **Global Content-Addressable Storage Store**. Downloaded package tarballs are stored centrally in \`~/.rahulchaube/cache\` and hard-linked into workspace \`node_modules\` directories.

This results in:
- Sub-second dependency installation for cached packages.
- Significant disk space savings across local projects.
- Text-based lockfile auditing via \`bun.lock\` formats.
`,
  },
  {
    slug: "building-modern-runtime",
    title: "Building a Modern Runtime Developer Experience",
    description:
      "Why developer diagnostics, system health checks, and visual dependency graphs matter in 2026.",
    date: "2026-07-10",
    tags: ["dx", "cli", "diagnostics"],
    category: "Design",
    author: "RahulChaube Engineering Team",
    body: `# Building a Modern Runtime Developer Experience

Fast execution is only half of the developer experience equation. Clear diagnostic feedback when things go wrong is equally crucial.

RahulChaube Runtime incorporates developer diagnostic tooling natively into the CLI:

- **\`rahulchaube doctor\`**: Eliminates "works on my machine" issues by inspecting PATH variables, node binaries, and environment flags.
- **\`rahulchaube explain\`**: Converts opaque stack traces into actionable debugging guidance.
- **\`rahulchaube graph\`**: Provides instant visual clarity on complex nested dependency trees.
`,
  },
];

export const posts = blogPosts;

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

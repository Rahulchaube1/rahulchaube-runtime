export interface DocPage {
  slug: string;
  title: string;
  section: string;
  body: string;
}

export const docSections = [
  "Getting Started",
  "CLI",
  "Package Manager",
  "Plugins",
  "Templates",
  "Architecture",
  "Migration",
  "API Reference",
] as const;

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((d) => d.slug === slug);
}

export const docs: DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    section: "Getting Started",
    body: `# Getting Started

Install RahulChaube Runtime and create your first project.

\`\`\`sh
curl -fsSL https://rahulchaube.space/install | bash
rahulchaube create react my-app
cd my-app && rahulchaube install && rahulchaube run dev
\`\`\`

RahulChaube Runtime runs TypeScript and JSX out of the box.
`,
  },
  {
    slug: "cli",
    title: "Command Line Interface",
    section: "CLI",
    body: `# CLI

\`\`\`sh
rahulchaube install      # install dependencies
rahulchaube add react    # add a dependency
rahulchaube run dev      # run a script
rahulchaube doctor       # diagnose environment
\`\`\`

Run \`rahulchaube --help\` for the full command list.
`,
  },
  {
    slug: "package-manager",
    title: "Package Manager",
    section: "Package Manager",
    body: `# Package Manager

RahulChaube includes a fast, modern package manager.

- \`rahulchaube why <pkg>\` — explain a dependency.
- \`rahulchaube outdated\` — list outdated packages.
- \`rahulchaube licenses\` — summarize dependency licenses.
- \`rahulchaube audit\` — scan for vulnerabilities.
`,
  },
  {
    slug: "plugins",
    title: "Plugins",
    section: "Plugins",
    body: `# Plugins

Extend the CLI with third-party plugins named \`rahulchaube-plugin-*\`.

\`\`\`sh
rahulchaube plugins install my-plugin
rahulchaube plugins list
\`\`\`
`,
  },
  {
    slug: "templates",
    title: "Templates",
    section: "Templates",
    body: `# Templates

Scaffold projects instantly:

\`\`\`sh
rahulchaube create react
rahulchaube create next
rahulchaube create express
rahulchaube create hono
rahulchaube create library
rahulchaube create cli
\`\`\`
`,
  },
  {
    slug: "architecture",
    title: "Architecture",
    section: "Architecture",
    body: `# Architecture

RahulChaube Runtime has two layers:

1. The engine (forked Bun core) — runtime, transpiler, bundler, installer.
2. The RahulChaube CLI — an independent TypeScript front-end for branding and DX.

The CLI delegates engine operations while presenting a rebranded experience.
`,
  },
  {
    slug: "migration",
    title: "Migration",
    section: "Migration",
    body: `# Migration

\`\`\`sh
rahulchaube migrate npm     # from npm
rahulchaube migrate yarn    # from yarn
rahulchaube migrate pnpm    # from pnpm
rahulchaube migrate bun     # from Bun
\`\`\`

The migrator detects your current tool and adjusts the project for RahulChaube.
`,
  },
  {
    slug: "api-reference",
    title: "API Reference",
    section: "API Reference",
    body: `# API Reference

The public API runs on \`/api\`:

- \`GET /api/health\` — health check
- \`GET /api/metrics\` — runtime metrics
- \`GET /api/openapi.json\` — OpenAPI spec
- \`POST /api/auth/token\` — issue a token
- \`GET /api/protected\` — protected resource
`,
  },
];

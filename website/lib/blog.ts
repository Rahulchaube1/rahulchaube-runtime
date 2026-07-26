export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  author: string;
  body: string;
}

export const posts: Post[] = [
  {
    slug: "introducing-rahulchaube-runtime",
    title: "Introducing RahulChaube Runtime",
    description:
      "Why we built an independent JavaScript runtime and developer platform on top of a proven engine.",
    date: "2026-07-15",
    tags: ["announcement", "runtime"],
    category: "News",
    author: "RahulChaube Team",
    body: `# Introducing RahulChaube Runtime

RahulChaube Runtime is an **independent software platform**. It is not
the official Bun, and is not affiliated with or endorsed by the Bun authors.

## Goals

- A fast JavaScript & TypeScript runtime.
- A premium, colorful CLI developer experience.
- A complete ecosystem: website, installer, registry scaffold, API, and docs.

## Getting started

\`\`\`sh
curl -fsSL https://rahulchaube.space/install | bash
rahulchaube --help
\`\`\`

Everything is built to be modular, runnable, and production-quality.
`,
  },
  {
    slug: "designing-the-cli",
    title: "Designing a premium CLI",
    description:
      "How the RahulChaube CLI delivers animated spinners, progress bars, tables, and better error messages.",
    date: "2026-07-10",
    tags: ["cli", "dx"],
    category: "Engineering",
    author: "RahulChaube Team",
    body: `# Designing a premium CLI

The \`rahulchaube\` CLI is dependency-free and runs on any Node or Bun runtime.

- **Colors & icons** for scannable output.
- **Spinners & progress bars** for long operations.
- **Tables** for structured reports (licenses, outdated, graph).
- **Interactive prompts** for project creation.

Run \`rahulchaube doctor\` to see it in action.
`,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

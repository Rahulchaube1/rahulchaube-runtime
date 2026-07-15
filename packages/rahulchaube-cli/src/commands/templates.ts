/**
 * Project templates for `rahulchaube create`.
 * Each template is a function that returns files to write (relative path -> contents).
 * Templates are intentionally dependency-light and framework-agnostic in spirit.
 */

export interface TemplateContext {
  name: string;
  dir: string;
}

export interface TemplateFile {
  path: string;
  contents: string;
}

export interface ProjectTemplate {
  id: string;
  label: string;
  description: string;
  deps?: string[];
  devDeps?: string[];
  files: (ctx: TemplateContext) => TemplateFile[];
}

function baseFiles(ctx: TemplateContext): TemplateFile[] {
  return [
    {
      path: "rahulchaube.json",
      contents: JSON.stringify(
        { telemetry: false, autoInstall: true, theme: "default", runtime: "rahulchaube" },
        null,
        2,
      ) + "\n",
    },
    {
      path: ".gitignore",
      contents: "node_modules\n.bun\n*.log\ndist\nout\n",
    },
  ];
}

function reactTemplate(ctx: TemplateContext): TemplateFile[] {
  return [
    ...baseFiles(ctx),
    {
      path: "package.json",
      contents: pkg(ctx, ["react", "react-dom"], ["@types/react", "@types/react-dom", "typescript"], {
        dev: "rahulchaube run --hot src/main.tsx",
        build: "rahulchaube build src/main.tsx --outdir dist --minify",
        test: "rahulchaube test",
      }),
    },
    { path: "tsconfig.json", contents: tsconfig() },
    {
      path: "src/main.tsx",
      contents: `import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
`,
    },
    {
      path: "src/App.tsx",
      contents: `export function App() {
  return <h1>Hello from ${ctx.name} ${"{"}🚀{"}"}</h1>;
}
`,
    },
    {
      path: "public/index.html",
      contents: `<!doctype html>
<html>
  <head><title>${ctx.name}</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
`,
    },
  ];
}

function nextTemplate(ctx: TemplateContext): TemplateFile[] {
  return [
    ...reactTemplate(ctx),
    {
      path: "src/pages/index.tsx",
      contents: `export default function Page() {
  return <h1>Welcome to ${ctx.name} (Next-style)</h1>;
}
`,
    },
    {
      path: "README.md",
      contents: `# ${ctx.name}\n\nCreated with RahulChaube Runtime (Next-style template).\n`,
    },
  ];
}

function expressTemplate(ctx: TemplateContext): TemplateFile[] {
  return [
    ...baseFiles(ctx),
    {
      path: "package.json",
      contents: pkg(ctx, ["express"], ["typescript", "@types/express"], {
        dev: "rahulchaube run --hot src/index.ts",
        build: "rahulchaube build src/index.ts --outdir dist --minify",
        start: "rahulchaube run dist/index.js",
      }),
    },
    { path: "tsconfig.json", contents: tsconfig() },
    {
      path: "src/index.ts",
      contents: `import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/", (_req, res) => res.json({ name: "${ctx.name}", runtime: "rahulchaube" }));

app.listen(port, () => console.log(\`${ctx.name} listening on http://localhost:\${port}\`));
`,
    },
  ];
}

function honoTemplate(ctx: TemplateContext): TemplateFile[] {
  return [
    ...baseFiles(ctx),
    {
      path: "package.json",
      contents: pkg(ctx, ["hono"], ["typescript"], {
        dev: "rahulchaube run --hot src/index.ts",
        build: "rahulchaube build src/index.ts --outdir dist --minify",
        start: "rahulchaube run dist/index.js",
      }),
    },
    { path: "tsconfig.json", contents: tsconfig() },
    {
      path: "src/index.ts",
      contents: `import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ name: "${ctx.name}", runtime: "rahulchaube" }));

export default app;
`,
    },
  ];
}

function libraryTemplate(ctx: TemplateContext): TemplateFile[] {
  return [
    ...baseFiles(ctx),
    {
      path: "package.json",
      contents: JSON.stringify(
        {
          name: ctx.name,
          version: "0.1.0",
          type: "module",
          main: "dist/index.js",
          module: "dist/index.js",
          types: "dist/index.d.ts",
          scripts: {
            build: "rahulchaube build src/index.ts --outdir dist --minify --sourcemap",
            test: "rahulchaube test",
          },
          devDependencies: { typescript: "^5.0.0" },
        },
        null,
        2,
      ) + "\n",
    },
    { path: "tsconfig.json", contents: tsconfig() },
    {
      path: "src/index.ts",
      contents: `export function greet(name: string): string {
  return \`Hello, \${name}! — powered by RahulChaube Runtime\`;
}
`,
    },
    {
      path: "test/index.test.ts",
      contents: `import { expect, test } from "rahulchaube";
import { greet } from "../src/index";

test("greet", () => {
  expect(greet("world")).toContain("world");
});
`,
    },
  ];
}

function cliTemplate(ctx: TemplateContext): TemplateFile[] {
  return [
    ...baseFiles(ctx),
    {
      path: "package.json",
      contents: pkg(ctx, [], ["typescript"], {
        dev: "rahulchaube run --hot src/main.ts",
        build: "rahulchaube build src/main.ts --compile --outfile dist/" + ctx.name,
        start: "rahulchaube run dist/" + ctx.name,
      }),
    },
    { path: "tsconfig.json", contents: tsconfig() },
    {
      path: "src/main.ts",
      contents: `const args = Bun.argv.slice(2);

console.log(\`${ctx.name} received args:\`, args);
`,
    },
  ];
}

function pkg(ctx: TemplateContext, deps: string[], devDeps: string[], scripts: Record<string, string>): string {
  return (
    JSON.stringify(
      {
        name: ctx.name,
        version: "0.1.0",
        type: "module",
        scripts: { ...scripts, test: scripts.test ?? "rahulchaube test" },
        dependencies: Object.fromEntries(deps.map((d) => [d, "latest"])),
        devDependencies: Object.fromEntries(devDeps.map((d) => [d, "latest"])),
      },
      null,
      2,
    ) + "\n"
  );
}

function tsconfig(): string {
  return (
    JSON.stringify(
      {
        compilerOptions: {
          target: "ESNext",
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ["src", "test"],
      },
      null,
      2,
    ) + "\n"
  );
}

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: "react",
    label: "React app",
    description: "Single-page React app with HMR.",
    deps: ["react", "react-dom"],
    devDeps: ["@types/react", "@types/react-dom", "typescript"],
    files: reactTemplate,
  },
  {
    id: "next",
    label: "Next-style app",
    description: "React with file-based pages.",
    deps: ["react", "react-dom"],
    devDeps: ["@types/react", "@types/react-dom", "typescript"],
    files: nextTemplate,
  },
  {
    id: "express",
    label: "Express server",
    description: "HTTP server with Express.",
    deps: ["express"],
    devDeps: ["typescript", "@types/express"],
    files: expressTemplate,
  },
  {
    id: "hono",
    label: "Hono server",
    description: "Lightweight edge-ready server.",
    deps: ["hono"],
    devDeps: ["typescript"],
    files: honoTemplate,
  },
  {
    id: "library",
    label: "Library",
    description: "Reusable TypeScript library with tests.",
    devDeps: ["typescript"],
    files: libraryTemplate,
  },
  {
    id: "cli",
    label: "CLI",
    description: "Command-line tool compiled to a binary.",
    devDeps: ["typescript"],
    files: cliTemplate,
  },
];

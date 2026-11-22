export interface DocPage {
  slug: string;
  title: string;
  section: string;
  body: string;
}

export const docSections = ["Getting Started", "Runtime", "Libraries", "Compatibility", "Project"] as const;

const page = (slug: string, title: string, section: typeof docSections[number], body: string): DocPage =>
  ({ slug, title, section, body: `# ${title}\n\n${body.trim()}` });

const code = (language: string, lines: string) => "\n\n```" + language + "\n" + lines.trim() + "\n```\n\n";

const install = `The installer downloads the archive for your operating system, checks its SHA-256 digest and installs the release under ~/.rc-runtime. On Linux and macOS, use Bash.` +
  code("sh", "curl -fsSL https://www.rahulchaube.space/install | bash") +
  "On Windows x64, use PowerShell." + code("powershell", "irm https://www.rahulchaube.space/install.ps1 | iex") +
  "Open a new terminal and check the executable." + code("sh", "rc --version");

const first = "Create a TypeScript application, run its tests and start the HTTP server." +
  code("sh", "rc init hello\ncd hello\nrc test\nrc run server.ts") +
  'Visit http://127.0.0.1:3000/hello/Rahul. The route responds with {"hello":"Rahul"}. Press Ctrl+C to stop the server.';

const web = 'Import `createApp`, `json` and `text` from `rc:web`. Register routes before starting the server.' +
  code("ts", 'import { createApp, json } from "rc:web";\n\nconst app = createApp();\napp.get("/hello/:name", ({ params }) => json({ hello: params.name }));\napp.post("/echo", ({ body }) => json({ body }, 201));\nconst server = app.listen({ hostname: "127.0.0.1", port: 3000 });') +
  'Routes match in registration order. Use `app.on(method, path, fn)` for other methods. Route handlers may return promises. A request exposes its method, escaped path, decoded route parameters, query and header arrays, and a UTF-8 body. The host accepts text bodies up to 1 MiB. Responses have a status, headers and text body. A missing route returns 404. A handler error returns 500.\n\n' +
  'Use port 0 to request an available port and read `server.port`. Call `server.close()` to stop accepting connections. The default listener uses the loopback interface. Set the hostname to `0.0.0.0` to listen on all IPv4 interfaces.\n\n## Testing a route\n' +
  code("ts", 'import { test, equal } from "rc:test";\nimport { app } from "./app";\n\ntest("greets Ada", async () => {\n  const res = await app.handle({ method: "GET", path: "/hello/Ada" });\n  equal(res.status, 200);\n  equal(JSON.parse(res.body).hello, "Ada");\n});');

const commands = [
  "`rc run <entry> [--] [args...]` runs JS or TS. Read arguments from `RC.args`.",
  "`rc build <entry> --outfile <file>` writes an ES module bundle.",
  "`rc init <new-directory>` generates a working RC Web application.",
  "`rc test [files...]` executes named files or discovers .test and .spec files recursively. Each file has its own VM.",
  "`rc install [--offline]` installs pinned, single-file ES modules declared in rc.json.",
  "`rc doctor` prints runtime and platform information.",
  "`rc --version` prints the installed release. `rc --help` lists the commands.",
].map(line => "- " + line).join("\n");

const modules = 'Build the library into one ES module with `rc build library.ts --outfile library.mjs`. Publish that file over HTTPS and compute its SHA-256 digest. In the consuming project, add a dependency entry to `rc.json` using the actual URL and its 64-character lowercase digest.' +
  code("json", '{\n  "dependencies": {\n    "my-library": {\n      "url": "https://example.org/releases/v1/library.mjs",\n      "sha256": "<SHA-256 of the published file>"\n    }\n  }\n}') +
  'Run `rc install` and import from `"my-library"` in your code. Commit rc.json to version control. The digest pins the bytes for each dependency. Verified modules live in .rc/modules and in your OS user cache. Use `rc install --offline` to restore a project from that cache.\n\n' +
  'Each dependency is a UTF-8 JavaScript bundle up to 16 MiB. Bundle relative imports before publishing. This package format is independent of the npm registry. For npm dependencies, use your project’s npm-compatible package manager. The native bundler can import pure JS packages whose runtime APIs it supports.';

const runtime = 'The native Go host embeds QuickJS-NG through quickjs-go and compiles TypeScript with esbuild. Local ES modules, literal dynamic imports, top-level await, CommonJS dependencies and JSON are supported through the bundled module graph. `console`, `setTimeout`, `clearTimeout` and `RC.args` are available in the host.\n\n' +
  'RC executes TypeScript without type checking. Applications using Node built-ins, Bun globals, browser DOM APIs, native Node add-ons or dynamic module names may require another host. JS programs run with the filesystem and network privileges of the current user.';

const compatibility = 'RC uses the rc executable and its own installation directory. Earlier rahulchaube CLI releases remain available on GitHub for projects that rely on the Bun-hosted commands. Node and Bun built-ins need a compatible host. The rc: libraries expose native RC APIs.';

const performance = "The Benchmarks page reports fresh-process timings, executable size and peak resident memory on the published host. Each workload checks its output. npm runs the program through a Node package script. Use the same programs and versions to compare on your system." +
  code("sh", "python3 benchmarks/compare.py --samples 25 > results.json");

export const docs: DocPage[] = [
  page("getting-started", "Getting started with RC Runtime", "Getting Started", install + "\n\n## Your first application\n\n" + first),
  page("installation", "Installation", "Getting Started", install + "\n\nArchives cover Linux x64/ARM64, macOS Intel/Apple Silicon and Windows x64. The Download page lists direct archives and their digests."),
  page("tutorials-first-steps", "Your first project", "Getting Started", first),
  page("cli", "CLI reference", "Runtime", commands),
  page("runtime", "JavaScript and TypeScript", "Runtime", runtime),
  page("bundler", "Bundling a program", "Runtime", "Build a source entry and its imports into one ES module." + code("sh", "rc build server.ts --outfile dist/server.mjs\nrc run dist/server.mjs") + "Bundles that use rc: modules require the RC host."),
  page("rc-web", "RC Web", "Libraries", web),
  page("how-to-build-rest-api", "Build an HTTP API", "Libraries", first + "\n\n" + web),
  page("api", "Built-in libraries", "Libraries", 'Use `rc:web` to serve HTTP and `rc:test` to register async or synchronous tests. `equal(actual, expected)` compares values using Object.is. `assert(value, message)` checks truthiness. The `rc:fs` library reads and writes UTF-8 files.' + code("ts", 'import { readText, writeText, readJSON, writeJSON } from "rc:fs";\nwriteJSON("status.json", { ready: true });\nconsole.log(readJSON("status.json").ready);')),
  page("package-manager", "Installing pinned modules", "Libraries", modules),
  page("configuration", "Project configuration", "Runtime", modules),
  page("project-structure", "Project files", "Getting Started", "rc init creates app.ts for your routes, server.ts for the listener, app.test.ts for tests and rc.json for pinned dependencies."),
  page("architecture", "Runtime architecture", "Runtime", runtime),
  page("explanations-architecture-and-lifecycle", "Execution lifecycle", "Runtime", runtime + "\n\nThe event loop drains promise jobs and timers and dispatches HTTP requests on the VM owner thread."),
  page("reference-cli-specification", "Command specification", "Runtime", commands),
  page("compatibility", "Compatibility and earlier releases", "Compatibility", compatibility),
  page("plugins", "Compatibility CLI plugins", "Compatibility", "The Bun-hosted rahulchaube CLI supports its original plugin commands. Run rahulchaube plugins --help for options."),
  page("benchmarks", "Reproduce the benchmarks", "Project", performance),
  page("performance", "Performance measurements", "Project", performance),
  page("faq", "Troubleshooting", "Getting Started", "## The shell cannot find rc\nOpen a new terminal or add ~/.rc-runtime/bin to PATH.\n\n## A package imports node:fs\nThe native host provides rc:fs. Use the Bun-hosted compatibility CLI for packages that depend on Node APIs.\n\n## A pinned module is missing\nRun rc install from the directory containing rc.json. Check that the URL and SHA-256 match the published file."),
  page("contributing", "Contributing", "Project", 'The repository accepts issues and pull requests. With Go 1.25+ and a C compiler, run the native tests from the native directory.' + code("sh", "go test ./...\ngo build -trimpath -o rc .")),
  page("license", "License", "Project", "Rahul Chaube releases RC Runtime under the MIT License. You can use, modify and redistribute it under those terms. The release archives include the license and third-party notices."),
];
export const getDoc = (slug: string) => docs.find(page => page.slug === slug);

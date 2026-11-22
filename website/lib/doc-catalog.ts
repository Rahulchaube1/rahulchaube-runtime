export const sections = [
  {
    id: "essentials",
    title: "Getting started",
    description: "Install RC, run a script and find your way around a project.",
  },
  {
    id: "guides",
    title: "Developer guides",
    description: "Build an HTTP service, write tests and ship your modules.",
  },
  {
    id: "reference",
    title: "API and CLI reference",
    description: "Look up commands, configuration, built-in modules and host APIs.",
  },
  {
    id: "project",
    title: "Inside RC Runtime",
    description: "Understand the engine, verify measurements and work on RC itself.",
  },
] as const;

export type SectionId = (typeof sections)[number]["id"];
export interface Guide {
  slug: string;
  title: string;
  section: SectionId;
  summary: string;
}
const guide = (section: SectionId, slug: string, title: string, summary: string): Guide => ({
  section,
  slug,
  title,
  summary,
});

export const guides = [
  guide(
    "essentials",
    "getting-started",
    "Run your first script",
    "Install RC and pass an argument to a TypeScript program.",
  ),
  guide(
    "essentials",
    "installation",
    "Installation",
    "Choose a platform, verify a download and configure your shell.",
  ),
  guide(
    "essentials",
    "project-structure",
    "Project files",
    "Find the entry point, tests, configuration and type declarations in a new project.",
  ),
  guide(
    "essentials",
    "faq",
    "Troubleshooting",
    "Resolve common installation, import, listener and test errors.",
  ),
  guide(
    "guides",
    "tutorials-first-steps",
    "Create a web app",
    "Scaffold a typed service, run the starter test and make a real HTTP request.",
  ),
  guide(
    "guides",
    "how-to-build-rest-api",
    "Add an HTTP endpoint",
    "Accept a JSON request, validate a name and return a greeting.",
  ),
  guide(
    "guides",
    "testing",
    "Test your service",
    "Exercise success and error responses directly against the router.",
  ),
  guide(
    "guides",
    "bundler",
    "Bundle and run",
    "Build the service into one ES module and run it from a clean directory.",
  ),
  guide(
    "guides",
    "watch-mode",
    "Watch for changes",
    "Restart an application or rebuild its bundle as you edit imported files.",
  ),
  guide(
    "guides",
    "package-manager",
    "Install pinned modules",
    "Add an HTTPS module to rc.json, verify its digest and restore it offline.",
  ),
  guide(
    "guides",
    "publishing-modules",
    "Publish a library",
    "Turn a TypeScript library into an ES module that other RC projects can use.",
  ),
  guide(
    "guides",
    "editor",
    "Editor extension",
    "Install the extension in VS Code, VSCodium or code-server and run, watch or test a saved file.",
  ),
  guide(
    "reference",
    "cli",
    "CLI reference",
    "Find the syntax, arguments and exit behavior of each rc command.",
  ),
  guide(
    "reference",
    "api",
    "Built-in libraries",
    "Choose a standard module for HTTP, testing or filesystem access.",
  ),
  guide(
    "reference",
    "rc-web",
    "RC Web",
    "Look up router methods, request fields, responses and listener options.",
  ),
  guide("reference", "rc-test", "Test API", "Register synchronous or asynchronous tests and compare values."),
  guide(
    "reference",
    "rc-fs",
    "Filesystem API",
    "Read and write text or JSON files using the current working directory.",
  ),
  guide(
    "reference",
    "runtime",
    "JavaScript and TypeScript",
    "Work with imports, arguments, timers, promises and TypeScript declarations.",
  ),
  guide(
    "reference",
    "configuration",
    "Project configuration",
    "Understand rc.json, module names, dependency digests and TypeScript settings.",
  ),
  guide(
    "reference",
    "website-api",
    "Release HTTP API",
    "Retrieve public version information, archive URLs, sizes and SHA-256 digests.",
  ),
  guide(
    "project",
    "architecture",
    "Runtime architecture",
    "Follow a source file through esbuild, QuickJS-NG and the native event loop.",
  ),
  guide(
    "project",
    "compatibility",
    "Compatibility and migration",
    "Check host APIs and move a project from the earlier CLI.",
  ),
  guide(
    "project",
    "benchmarks",
    "Reproduce benchmarks",
    "Measure process startup, memory, arithmetic and cached installs.",
  ),
  guide(
    "project",
    "contributing",
    "Build from source",
    "Compile and test the native host and contribute improvements on GitHub.",
  ),
  guide(
    "project",
    "license",
    "License and notices",
    "Find the project license, author and licenses shipped with the binary.",
  ),
];

export const getGuide = (slug: string) => guides.find((item) => item.slug === slug);
export const getSection = (id: SectionId) => sections.find((section) => section.id === id)!;
export const lessons = [
  "getting-started",
  "tutorials-first-steps",
  "how-to-build-rest-api",
  "testing",
  "bundler",
].map((slug) => getGuide(slug)!);
export const docUrl = (guide: Guide) => "/docs/" + guide.slug;

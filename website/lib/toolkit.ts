export const commandNames = ["fmt", "check", "build", "test", "install", "run"] as const;
export type CommandName = (typeof commandNames)[number];

export const commandInfo = {
  fmt: {
    title: "Format source files",
    summary:
      "Apply consistent spacing and indentation to JavaScript and TypeScript. Use the same formatter locally and in CI.",
    example: "rc fmt src\nrc fmt --check src",
    experiment: "Format TypeScript files",
    fixture:
      "Each file starts with an unformatted typed export. The harness restores the original source before each run and verifies every edit afterward.",
  },
  check: {
    title: "Find type errors",
    summary:
      "Check a file or a whole TypeScript project, including its imports and RC’s built-in APIs. Diagnostics identify the file, line and column.",
    example: "rc check -p tsconfig.json",
    experiment: "Check a strict TypeScript project",
    fixture:
      "The project includes a strict tsconfig and one typed export per file. The checker reads the bundled declarations and must finish with zero diagnostics.",
  },
  build: {
    title: "Bundle a module graph",
    summary:
      "Resolve local imports and compile TypeScript into an ES module. Watch the graph during development or write a bundle for release.",
    example: "rc build app.ts --outfile dist/app.mjs",
    experiment: "Bundle TypeScript imports",
    fixture:
      "One entry imports a number from each dependency. The harness removes the previous bundle, times the build, then executes the output and verifies the sum.",
  },
  test: {
    title: "Run a test suite",
    summary:
      "Discover project tests or run a single file. Write synchronous and asynchronous assertions with the built-in rc:test library.",
    example: "rc test\nrc test app.test.ts",
    experiment: "Run assertions in one suite",
    fixture:
      "One suite registers the indicated number of tests. Each test checks an integer result. The harness counts the passing tests after each fresh process exits.",
  },
  install: {
    title: "Install pinned modules",
    summary:
      "Install bundled ES modules by HTTPS URL and SHA-256 digest. Restore verified modules from the local cache when working offline.",
    example: "rc install\nrc install --offline",
    experiment: "Restore verified modules offline",
    fixture:
      "The user cache contains the pinned ES modules. The project installation is removed before every run. The harness verifies each restored file byte for byte.",
  },
  run: {
    title: "Execute JavaScript and TypeScript",
    summary:
      "Launch a script with arguments or restart it when an import changes. The executable includes QuickJS-NG, esbuild and RC’s host APIs.",
    example: "rc run hello.ts -- Rahul\nrc run --watch server.ts",
    experiment: "Execute a TypeScript import graph",
    fixture:
      "One TypeScript entry imports and sums the values exported by its dependencies. Elapsed time includes compilation, execution, output and process exit.",
  },
} satisfies Record<
  CommandName,
  { title: string; summary: string; example: string; experiment: string; fixture: string }
>;

export function isCommand(name: string): name is CommandName {
  return commandNames.some((command) => command === name);
}

import { afterAll, beforeAll, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";
import {
  appendFileSync,
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { guides, lessons } from "../lib/doc-catalog.ts";
import { guideHeadings, readGuide as readSource, searchIndex } from "../lib/docs.ts";
import { searchGuides } from "../lib/doc-search.ts";

const website = fileURLToPath(new URL("../", import.meta.url));
const content = join(website, "content", "docs");
const readGuide = (slug) => readSource(slug, content);
const tmp = mkdtempSync(join(tmpdir(), "rc-handbook-"));
const target = process.platform === "win32" ? "win" : process.platform;
const rc = join(tmp, "bin", target === "win" ? "rc.exe" : "rc");
const run = (cwd, ...args) => execFileSync(rc, args, { cwd, encoding: "utf8", timeout: 10_000 });
const snippets = (slug, lang) =>
  [...readGuide(slug).matchAll(/^```([^\n]*)\n([\s\S]*?)^```$/gm)]
    .filter((match) => match[1] === lang)
    .map((match) => match[2]);

beforeAll(() => {
  const ext = target === "win" ? "zip" : "tar.gz";
  const filename = `runtime-${target}-${process.arch}.${ext}`;
  const manifest = JSON.parse(readFileSync(resolve(website, "../dist/version.json"), "utf8"));
  const archive = resolve(website, "../dist", filename);
  expect(createHash("sha256").update(readFileSync(archive)).digest("hex")).toBe(manifest.sha256[filename]);
  execFileSync("tar", ["-xf", archive, "-C", tmp]);
});
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

test("every guide has searchable content, unique section links and a matching source file", () => {
  const slugs = guides.map((guide) => guide.slug);
  expect(new Set(slugs).size).toBe(guides.length);
  expect(readdirSync(content).sort()).toEqual(slugs.map((slug) => slug + ".md").sort());
  for (const { slug } of guides) {
    const body = readGuide(slug);
    const ids = guideHeadings(body).map((heading) => heading.id);
    expect(ids.length).toBeGreaterThan(1);
    expect(new Set(ids).size).toBe(ids.length);
    for (const [, destination, anchor] of body.matchAll(/\]\(\/docs\/([a-z0-9-]+)(?:#([a-z0-9-]+))?\)/g)) {
      expect(slugs).toContain(destination);
      if (anchor) expect(guideHeadings(readGuide(destination)).map((item) => item.id)).toContain(anchor);
    }
  }
  expect(searchGuides(searchIndex(content), "rc:fs")[0].slug).toBe("rc-fs");
  expect(searchGuides(searchIndex(content), "unfindable-marker")).toHaveLength(0);
});

test("handbook sources accept Windows line endings", () => {
  const windowsSource = join(tmp, "windows-source");
  mkdirSync(windowsSource);
  writeFileSync(
    join(windowsSource, "getting-started.md"),
    readGuide("getting-started").replaceAll("\n", "\r\n"),
  );
  expect(readSource("getting-started", windowsSource)).toBe(readGuide("getting-started"));
});

test("the five published lessons build a working, tested greeting service", async () => {
  expect(lessons.map((guide) => guide.slug)).toEqual([
    "getting-started",
    "tutorials-first-steps",
    "how-to-build-rest-api",
    "testing",
    "bundler",
  ]);
  writeFileSync(join(tmp, "hello.ts"), snippets("getting-started", "ts")[0]);
  expect(run(tmp, "run", "hello.ts", "--", "Rahul").trim()).toBe("Hello, Rahul!");
  run(tmp, "init", "hello");
  const app = join(tmp, "hello");
  expect(run(app, "test")).toContain("pass greets a visitor by name");
  appendFileSync(join(app, "app.ts"), "\n" + snippets("how-to-build-rest-api", "ts")[0]);
  writeFileSync(join(app, "greetings.test.ts"), snippets("testing", "ts")[0]);
  const output = run(app, "test");
  expect(output).toContain("pass creates a greeting");
  expect(output).toContain("pass requires a name");
  // Use the OS-assigned port so the documented service can run beside other tests.
  const entry = join(app, "server.ts");
  writeFileSync(entry, readFileSync(entry, "utf8").replace("port: 3000", "port: 0"));
  run(app, "build", "server.ts", "--outfile", "dist/server.mjs");
  const deployment = join(tmp, "deployment");
  mkdirSync(deployment);
  copyFileSync(join(app, "dist/server.mjs"), join(deployment, "server.mjs"));
  const child = spawn(rc, ["run", "server.mjs"], { cwd: deployment, stdio: ["ignore", "pipe", "pipe"] });
  const stopped = once(child, "exit");
  const lines = createInterface({ input: child.stdout });
  try {
    const [message] = await once(lines, "line", { signal: AbortSignal.timeout(6000) });
    const address = message.match(/^Listening on (http:\/\/127\.0\.0\.1:\d+)$/)?.[1];
    expect(address).toBeDefined();
    const response = await fetch(address + "/greetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ada" }),
      signal: AbortSignal.timeout(4000),
    });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ hello: "Ada" });
  } finally {
    lines.close();
    child.kill();
    await stopped;
  }
}, 12_000);

test("filesystem, test and library examples execute as printed", () => {
  const work = join(tmp, "modules");
  mkdirSync(work);
  for (const [i, code] of snippets("rc-fs", "ts").entries()) {
    writeFileSync(join(work, "files.ts"), code);
    expect(run(work, "run", "files.ts").trim()).toBe(i === 0 ? "Hello from RC" : "true");
  }
  const [lib, checks] = snippets("publishing-modules", "ts");
  writeFileSync(join(work, "numbers.ts"), lib);
  writeFileSync(join(work, "numbers.test.ts"), checks);
  writeFileSync(join(work, "async.test.ts"), snippets("rc-test", "ts")[0]);
  expect(run(work, "test")).toContain("pass doubles a value");
  run(work, "build", "numbers.ts", "--outfile", "numbers.mjs");
  writeFileSync(join(work, "entry.ts"), 'import { double } from "./numbers.mjs"; console.log(double(21));');
  expect(run(work, "run", "entry.ts").trim()).toBe("42");
});

test("the public pinned-module example matches the library shipped by the website", () => {
  const manifest = JSON.parse(snippets("package-manager", "json")[0]);
  const dep = manifest.dependencies.hello;
  const url = new URL(dep.url);
  expect(url.origin).toBe("https://www.rahulchaube.space");
  const bytes = readFileSync(join(website, "public", url.pathname));
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(dep.sha256);
  const app = join(tmp, "pinned");
  const cache = join(app, ".rc", "modules");
  mkdirSync(cache, { recursive: true });
  writeFileSync(join(cache, dep.sha256 + ".mjs"), bytes);
  writeFileSync(join(app, "rc.json"), JSON.stringify(manifest));
  writeFileSync(join(app, "main.ts"), snippets("package-manager", "ts")[0]);
  expect(run(app, "install", "--offline")).toContain("Verified 1");
  expect(run(app, "run", "main.ts").trim()).toBe("Hello, Ada! — powered by RC Runtime\n42");
});

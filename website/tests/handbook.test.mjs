import { afterAll, beforeAll, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { execFileSync, spawn, spawnSync } from "node:child_process";
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
import { helloExample } from "../lib/hello-example.ts";
import { GET as downloadHello } from "../app/examples/hello.ts/route.ts";
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

test("the homepage download runs the first lesson and prints the output shown in the hero", async () => {
  const response = downloadHello();
  expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="hello.ts"');
  const source = await response.text();
  expect(source.trimEnd()).toBe(snippets("getting-started", "ts")[0].trimEnd());
  const project = join(tmp, "homepage");
  mkdirSync(project);
  writeFileSync(join(project, "hello.ts"), source);
  expect(run(project, ...helloExample.args).trim()).toBe(helloExample.output);
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

test("the six command guides match the released CLI", () => {
  const project = join(tmp, "commands");
  mkdirSync(project);
  writeFileSync(join(project, "price.ts"), snippets("fmt", "ts")[0]);
  expect(spawnSync(rc, ["fmt", "--check", "price.ts"], { cwd: project }).status).toBe(1);
  run(project, "fmt", "price.ts");
  run(project, "fmt", "--check", "price.ts");
  expect(run(project, "run", "price.ts").trim()).toBe("42");

  writeFileSync(join(project, "price.ts"), snippets("check", "ts")[0]);
  const diagnostic = spawnSync(rc, ["check", "price.ts"], { cwd: project, encoding: "utf8" });
  expect(diagnostic.status).toBe(1);
  expect(diagnostic.stderr).toContain("TS2322");
  writeFileSync(join(project, "price.ts"), snippets("check", "ts")[0].replace('"21"', "21"));
  expect(run(project, "check", "price.ts")).toContain("Checked 1 source file");

  writeFileSync(join(project, "answer.ts"), snippets("build", "ts")[0]);
  run(project, "build", "answer.ts", "--outfile", "dist/answer.mjs");
  expect(run(project, "run", "dist/answer.mjs").trim()).toBe("42");
  writeFileSync(join(project, "math.test.ts"), snippets("test", "ts")[0]);
  expect(run(project, "test", "math.test.ts")).toContain("pass awaits a result");
  writeFileSync(join(project, "hello.ts"), snippets("run", "ts")[0]);
  expect(run(project, "run", "hello.ts", "--", "Rahul").trim()).toBe("Hello, Rahul!");

  const manifest = JSON.parse(snippets("package-manager", "json")[0]);
  const { sha256 } = manifest.dependencies.hello;
  const modules = join(project, ".rc", "modules");
  mkdirSync(modules, { recursive: true });
  copyFileSync(join(website, "public/modules/hello-1.0.0.mjs"), join(modules, sha256 + ".mjs"));
  writeFileSync(join(project, "rc.json"), JSON.stringify(manifest));
  expect(run(project, "install", "--offline")).toContain("Verified 1 modules");
}, 25000);

test("each command chart is backed by complete samples from this release", () => {
  const report = JSON.parse(readFileSync(join(website, "public/toolkit-benchmarks.json"), "utf8"));
  const names = guides.filter(guide => guide.section === "commands").map(guide => guide.slug);
  expect(Object.keys(report.commands)).toEqual(names);
  expect(report.version).toBe(run(tmp, "--version").trim());
  expect(report.samples).toBeGreaterThanOrEqual(11);
  expect(report.warmups).toBeGreaterThan(0);
  for (const name of names) {
    const { rows } = report.commands[name];
    expect(rows.map(row => row.size)).toEqual([1, 8, 32]);
    for (const row of rows) {
      const samples = [...row.samples_ms].sort((a, b) => a - b);
      expect(samples).toHaveLength(report.samples);
      expect(samples[0]).toBeGreaterThan(0);
      const middle = Math.floor(samples.length / 2);
      const median = samples.length % 2 ? samples[middle] : (samples[middle - 1] + samples[middle]) / 2;
      expect(row.median_ms).toBeCloseTo(median, 2);
      expect(row.p95_ms).toBe(samples[Math.ceil(samples.length * 0.95) - 1]);
    }
  }
});

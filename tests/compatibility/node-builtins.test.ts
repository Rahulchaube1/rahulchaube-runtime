/**
 * RahulChaube Runtime — Compatibility Suite: Node.js Built-ins (Tests 211–270).
 */
import { test, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import * as os from "node:os";
import * as util from "node:util";
import { URL, URLSearchParams } from "node:url";

// 211-225. File System (fs)
test("Node FS: existsSync and statSync", () => {
  const pkgPath = path.resolve(process.cwd(), "packages/rahulchaube-cli/package.json");
  expect(fs.existsSync(pkgPath)).toBe(true);

  const stats = fs.statSync(pkgPath);
  expect(stats.isFile()).toBe(true);
  expect(stats.size).toBeGreaterThan(0);
});

test("Node FS: readFileSync and readdirSync", () => {
  const pkgPath = path.resolve(process.cwd(), "packages/rahulchaube-cli/package.json");
  const content = fs.readFileSync(pkgPath, "utf-8");
  expect(content).toContain("rahulchaube");

  const files = fs.readdirSync(process.cwd());
  expect(files).toContain("packages");
});

// 226-240. Path Utilities
test("Node Path: resolve, join, dirname, extname, basename", () => {
  const joined = path.join("foo", "bar", "baz.ts");
  expect(joined).toContain("baz.ts");

  expect(path.extname("app.test.ts")).toBe(".ts");
  expect(path.basename("/a/b/c.js")).toBe("c.js");
  expect(path.basename("/a/b/c.js", ".js")).toBe("c");
  expect(path.dirname("/a/b/c.js")).toContain("b");
});

// 241-255. Crypto Subsystem
test("Node Crypto: createHash SHA-256 and MD5", () => {
  const sha256 = crypto.createHash("sha256").update("RahulChaube").digest("hex");
  expect(sha256).toHaveLength(64);

  const md5 = crypto.createHash("md5").update("Runtime").digest("hex");
  expect(md5).toHaveLength(32);
});

test("Node Crypto: randomBytes and randomUUID", () => {
  const buf = crypto.randomBytes(16);
  expect(buf.length).toBe(16);

  const uuid = crypto.randomUUID();
  expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
});

// 256-265. OS, Util, URL
test("Node OS: platform, arch, cpus, totalmem", () => {
  expect(typeof os.platform()).toBe("string");
  expect(typeof os.arch()).toBe("string");
  expect(os.cpus().length).toBeGreaterThan(0);
  expect(os.totalmem()).toBeGreaterThan(0);
});

test("Node Util: format and promisify", async () => {
  const formatted = util.format("Hello %s, code %d", "World", 42);
  expect(formatted).toBe("Hello World, code 42");

  const sleep = util.promisify(setTimeout);
  const start = Date.now();
  await sleep(10);
  expect(Date.now() - start).toBeGreaterThanOrEqual(8);
});

test("Node URL: URL and URLSearchParams parsing", () => {
  const myUrl = new URL("https://rahulchaube.space/docs?search=runtime&page=1");
  expect(myUrl.hostname).toBe("rahulchaube.space");
  expect(myUrl.pathname).toBe("/docs");

  const params = new URLSearchParams(myUrl.search);
  expect(params.get("search")).toBe("runtime");
  expect(params.get("page")).toBe("1");
});

// 266-270. Buffer Operations
test("Node Buffer: alloc, from, toString, and concat", () => {
  const b1 = Buffer.from("Rahul");
  const b2 = Buffer.from("Chaube");
  const combined = Buffer.concat([b1, Buffer.from(" "), b2]);

  expect(combined.toString("utf-8")).toBe("Rahul Chaube");
  expect(b1.subarray(0, 2).toString()).toBe("Ra");
});

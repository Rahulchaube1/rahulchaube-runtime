/**
 * RahulChaube Runtime — Compatibility Suite: Advanced Node APIs & Standard Built-ins (Tests 471–520).
 */
import { test, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";
import * as querystring from "node:querystring";
import * as assert from "node:assert";

// 471-485. Compression & Decompression (zlib)
test("Node Advanced: zlib gzipSync and gunzipSync", () => {
  const input = Buffer.from("RahulChaube Compression Payload Data String");
  const compressed = zlib.gzipSync(input);
  expect(compressed.length).toBeGreaterThan(0);

  const decompressed = zlib.gunzipSync(compressed);
  expect(decompressed.toString()).toBe("RahulChaube Compression Payload Data String");
});

test("Node Advanced: zlib deflateSync and inflateSync", () => {
  const input = Buffer.from("Deflate Data Stream");
  const compressed = zlib.deflateSync(input);
  const decompressed = zlib.inflateSync(compressed);
  expect(decompressed.toString()).toBe("Deflate Data Stream");
});

// 486-500. Querystring & Assert
test("Node Advanced: querystring stringify and parse", () => {
  const obj = { name: "Rahul", page: "1", tags: ["a", "b"] };
  const str = querystring.stringify(obj);
  expect(str).toContain("name=Rahul");

  const parsed = querystring.parse("foo=bar&baz=qux");
  expect(parsed.foo).toBe("bar");
  expect(parsed.baz).toBe("qux");
});

test("Node Advanced: assert.strictEqual and assert.deepStrictEqual", () => {
  expect(() => assert.strictEqual(1, 1)).not.toThrow();
  expect(() => assert.deepStrictEqual({ a: [1, 2] }, { a: [1, 2] })).not.toThrow();
  expect(() => assert.strictEqual(1 as any, "1" as any)).toThrow();
});

// 501-520. File System & Path Advanced
test("Node Advanced: fs copyFileSync, mkdirSync recursive, and rmSync", () => {
  const tmpDir = path.resolve(process.cwd(), ".tmp_test_fs_advanced");
  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });

  fs.mkdirSync(path.join(tmpDir, "sub", "dir"), { recursive: true });
  expect(fs.existsSync(path.join(tmpDir, "sub", "dir"))).toBe(true);

  const srcFile = path.join(tmpDir, "src.txt");
  const destFile = path.join(tmpDir, "dest.txt");
  fs.writeFileSync(srcFile, "copy payload");
  fs.copyFileSync(srcFile, destFile);

  expect(fs.readFileSync(destFile, "utf-8")).toBe("copy payload");
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

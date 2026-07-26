import { test, expect, beforeEach, afterEach } from "bun:test";
import { FileWatcher } from "../runtime/watcher/watcher.ts";
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TMP_WATCH_DIR = resolve(process.cwd(), ".tmp_test_watcher");

beforeEach(() => {
  if (existsSync(TMP_WATCH_DIR)) rmSync(TMP_WATCH_DIR, { recursive: true });
  mkdirSync(TMP_WATCH_DIR, { recursive: true });
});

afterEach(() => {
  if (existsSync(TMP_WATCH_DIR)) rmSync(TMP_WATCH_DIR, { recursive: true });
});

test("FileWatcher: detects file modification and calls callback", async () => {
  const watchFile = resolve(TMP_WATCH_DIR, "watched.ts");
  writeFileSync(watchFile, "const initial = 1;");

  let triggered = false;
  const watcher = new FileWatcher(watchFile, () => {
    triggered = true;
  }, 20); // 20ms debounce

  watcher.start();
  expect(watcher.isActive()).toBe(true);

  await new Promise((r) => setTimeout(r, 50));
  writeFileSync(watchFile, "const updated = 2;");

  await new Promise((r) => setTimeout(r, 100));
  expect(triggered).toBe(true);

  watcher.stop();
  expect(watcher.isActive()).toBe(false);
});

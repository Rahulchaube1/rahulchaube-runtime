import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, watch, writeFileSync, type FSWatcher } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join } from "node:path";
import { stripVTControlCharacters } from "node:util";

// The Windows host locks each source file it watches against replacement. Give it a
// private preload to watch and subscribe to directory changes for the real modules.
export async function runWindowsLive(mode: "--watch" | "--hot", cwd: string, entry: string, args: string[]): Promise<number> {
  const control = mkdtempSync(join(tmpdir(), "rc-live-"));
  const preload = join(control, "reload.cjs");
  const directories = new Map<string, { files: Set<string>; watcher: FSWatcher }>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;
  function trigger() {
    writeFileSync(preload, `process.chdir(${JSON.stringify(cwd)});\n// ${generation++}\n`);
  }
  function track(file: string) {
    if (!isAbsolute(file)) return;
    const dir = dirname(file);
    const key = dir.toLowerCase();
    let directory = directories.get(key);
    if (!directory) {
      const files = new Set<string>();
      let watcher: FSWatcher;
      try {
        watcher = watch(dir, (_event, name) => {
          if (name && !files.has(name.toLowerCase())) return;
          clearTimeout(timer);
          timer = setTimeout(trigger, 35);
        });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("RC Runtime could not watch", dir, error);
        return;
      }
      watcher.on("error", error => {
        watcher.close();
        directories.delete(key);
        if (existsSync(dir)) console.error("RC Runtime could not watch", dir, error);
      });
      directory = { files, watcher };
      directories.set(key, directory);
    }
    directory.files.add(basename(file).toLowerCase());
  }

  try {
    track(entry);
    trigger();
    const config = join(cwd, "bunfig.toml");
    const options = existsSync(config) ? ["--config", config] : [];
    const child = spawn(process.execPath, [mode, ...options, "--preload", preload, entry, ...args], {
      cwd: control, stdio: ["inherit", "inherit", "pipe"],
    });
    // The host reports each loaded module outside its private watch root, including
    // dynamic imports. Watch only those files so application output cannot cause a loop.
    const warning = /^warn: (File|Directory) (.+) is not in the project directory and will not be watched$/;
    let pending = "";
    function forward(line: string) {
      const match = warning.exec(stripVTControlCharacters(line).trim());
      if (match) {
        if (match[1] === "File") track(match[2]);
      } else {
        process.stderr.write(line);
      }
    }
    child.stderr.setEncoding("utf8").on("data", (chunk: string) => {
      pending += chunk;
      let end: number;
      while ((end = pending.indexOf("\n")) !== -1) {
        forward(pending.slice(0, end + 1));
        pending = pending.slice(end + 1);
      }
      // Deliver prompts and application stderr even when they have no trailing newline.
      const text = stripVTControlCharacters(pending);
      if (text && !"warn: ".startsWith(text) && !text.startsWith("warn: ")) {
        process.stderr.write(pending);
        pending = "";
      }
    });
    const stop = () => { child.kill(); };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    try {
      return await new Promise<number>((resolve, reject) => {
        child.once("error", reject);
        child.once("close", code => {
          if (pending) forward(pending);
          resolve(code ?? 1);
        });
      });
    } finally {
      process.off("SIGINT", stop);
      process.off("SIGTERM", stop);
    }
  } finally {
    clearTimeout(timer);
    for (const dir of directories.values()) dir.watcher.close();
    rmSync(control, { recursive: true, force: true, maxRetries: 4, retryDelay: 50 });
  }
}

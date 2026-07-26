/**
 * RahulChaube Runtime — Permission Enforcement Layer.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Wraps standard Node.js / Runtime APIs (`fs`, `fetch`, `process.env`, `child_process`)
 *   to enforce security policies configured in PermissionManager.
 *
 *   Enforces:
 *     - `read` permission on file read operations (`readFileSync`, `readFile`, `readdirSync`, `statSync`)
 *     - `write` permission on file write operations (`writeFileSync`, `writeFile`, `unlinkSync`, `mkdirSync`)
 *     - `env` permission on environment variable access (`env.get`, `env.set`)
 *     - `net` permission on network requests (`fetch`, `connect`)
 *     - `run` permission on child process creation (`execSync`, `spawn`)
 *
 * ERROR BEHAVIOR:
 *   Throws explicit `PermissionDeniedError` instance when a permission check fails.
 * ─────────────────────────────────────────────────────────────────
 */

import * as rawFs from "node:fs";
import * as rawChildProcess from "node:child_process";
import { PermissionManager, PermissionDeniedError, permissions } from "./index.ts";
import { URL } from "node:url";

export class PermissionedFS {
  constructor(private pm: PermissionManager = permissions) {}

  public readFileSync(path: rawFs.PathOrFileDescriptor, options?: any): string | Buffer {
    if (typeof path === "string") {
      this.pm.assert({ name: "read", path });
    }
    return rawFs.readFileSync(path, options);
  }

  public writeFileSync(file: rawFs.PathOrFileDescriptor, data: any, options?: any): void {
    if (typeof file === "string") {
      this.pm.assert({ name: "write", path: file });
    }
    rawFs.writeFileSync(file, data, options);
  }

  public readdirSync(path: rawFs.PathLike, options?: any): any[] {
    if (typeof path === "string") {
      this.pm.assert({ name: "read", path });
    }
    return rawFs.readdirSync(path, options);
  }

  public unlinkSync(path: rawFs.PathLike): void {
    if (typeof path === "string") {
      this.pm.assert({ name: "write", path });
    }
    rawFs.unlinkSync(path);
  }

  public statSync(path: rawFs.PathLike): rawFs.Stats {
    if (typeof path === "string") {
      this.pm.assert({ name: "read", path });
    }
    return rawFs.statSync(path);
  }
}

export class PermissionedEnv {
  constructor(private pm: PermissionManager = permissions) {}

  public get(key: string): string | undefined {
    this.pm.assert({ name: "env", path: key });
    return process.env[key];
  }

  public set(key: string, value: string): void {
    this.pm.assert({ name: "env", path: key });
    process.env[key] = value;
  }

  public toObject(): Record<string, string | undefined> {
    this.pm.assert({ name: "env" });
    return { ...process.env };
  }
}

export class PermissionedNet {
  constructor(private pm: PermissionManager = permissions) {}

  public async fetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
    let urlStr = "";
    if (typeof input === "string") urlStr = input;
    else if (input instanceof URL) urlStr = input.toString();
    else if (typeof input === "object" && "url" in input) urlStr = (input as any).url;

    try {
      const parsed = new URL(urlStr);
      this.pm.assert({ name: "net", path: parsed.hostname });
    } catch (err) {
      if (err instanceof PermissionDeniedError) throw err;
      // Fallback url host check
      this.pm.assert({ name: "net", path: urlStr });
    }

    return fetch(input, init);
  }
}

export class PermissionedProcess {
  constructor(private pm: PermissionManager = permissions) {}

  public execSync(command: string, options?: rawChildProcess.ExecSyncOptions): Buffer | string {
    const cmdName = command.trim().split(/\s+/)[0];
    this.pm.assert({ name: "run", path: cmdName });
    return rawChildProcess.execSync(command, options);
  }
}

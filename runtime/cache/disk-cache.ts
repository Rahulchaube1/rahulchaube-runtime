/**
 * RahulChaube Runtime — Persistent Disk Cache.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements multi-category persistent disk caching under `~/.rahulchaube/cache/`:
 *     - `modules/` → Transpiled TypeScript outputs (keyed by SHA1 hash + path)
 *     - `registry/` → Cached npm package metadata JSON
 *     - `binaries/` → Cached package tarballs and prebuilt binaries
 *
 *   Invalidates modules automatically if source hash or mtime changes.
 * ─────────────────────────────────────────────────────────────────
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

export interface DiskCacheStats {
  modulesCount: number;
  registryCount: number;
  binariesCount: number;
  totalSizeBytes: number;
}

export class PersistentDiskCache {
  private baseDir: string;
  private modulesDir: string;
  private registryDir: string;
  private binariesDir: string;

  constructor(customBaseDir?: string) {
    const home = process.env.USERPROFILE || process.env.HOME || process.cwd();
    this.baseDir = customBaseDir ?? resolve(home, ".rahulchaube", "cache");

    this.modulesDir = resolve(this.baseDir, "modules");
    this.registryDir = resolve(this.baseDir, "registry");
    this.binariesDir = resolve(this.baseDir, "binaries");

    this.ensureDirs();
  }

  private ensureDirs(): void {
    if (!existsSync(this.modulesDir)) mkdirSync(this.modulesDir, { recursive: true });
    if (!existsSync(this.registryDir)) mkdirSync(this.registryDir, { recursive: true });
    if (!existsSync(this.binariesDir)) mkdirSync(this.binariesDir, { recursive: true });
  }

  /**
   * Return cached compiled code if source text hash and file mtime match.
   */
  public getModule(filePath: string, sourceText: string): string | null {
    const hash = this.hashString(filePath + ":" + sourceText);
    const cacheFile = resolve(this.modulesDir, `${hash}.json`);

    if (!existsSync(cacheFile)) return null;

    try {
      const data = JSON.parse(readFileSync(cacheFile, "utf-8"));
      // mtime check
      if (existsSync(filePath)) {
        const mtime = statSync(filePath).mtimeMs;
        if (mtime > data.mtime) return null;
      }
      return data.compiledCode;
    } catch {
      return null;
    }
  }

  /**
   * Save compiled code to persistent disk cache.
   */
  public setModule(filePath: string, sourceText: string, compiledCode: string): void {
    const hash = this.hashString(filePath + ":" + sourceText);
    const cacheFile = resolve(this.modulesDir, `${hash}.json`);

    let mtime = Date.now();
    if (existsSync(filePath)) {
      mtime = statSync(filePath).mtimeMs;
    }

    const payload = {
      filePath,
      hash,
      mtime,
      compiledCode,
      createdAt: Date.now(),
    };

    writeFileSync(cacheFile, JSON.stringify(payload), "utf-8");
  }

  /**
   * Get cached registry metadata JSON.
   */
  public getRegistryData<T>(key: string): T | null {
    const hash = this.hashString(key);
    const cacheFile = resolve(this.registryDir, `${hash}.json`);

    if (!existsSync(cacheFile)) return null;

    try {
      const payload = JSON.parse(readFileSync(cacheFile, "utf-8"));
      if (payload.expiresAt && Date.now() > payload.expiresAt) return null;
      return payload.data as T;
    } catch {
      return null;
    }
  }

  /**
   * Set registry metadata in disk cache with optional TTL.
   */
  public setRegistryData<T>(key: string, data: T, ttlMs: number = 300_000): void {
    const hash = this.hashString(key);
    const cacheFile = resolve(this.registryDir, `${hash}.json`);

    const payload = {
      key,
      data,
      expiresAt: Date.now() + ttlMs,
    };

    writeFileSync(cacheFile, JSON.stringify(payload), "utf-8");
  }

  /**
   * Get binary / tarball buffer from disk cache.
   */
  public getBinary(key: string): Buffer | null {
    const hash = this.hashString(key);
    const cacheFile = resolve(this.binariesDir, `${hash}.bin`);

    if (!existsSync(cacheFile)) return null;
    return readFileSync(cacheFile);
  }

  /**
   * Save binary / tarball buffer to disk cache.
   */
  public setBinary(key: string, buffer: Buffer): void {
    const hash = this.hashString(key);
    const cacheFile = resolve(this.binariesDir, `${hash}.bin`);
    writeFileSync(cacheFile, buffer);
  }

  public clear(): void {
    if (existsSync(this.baseDir)) {
      rmSync(this.baseDir, { recursive: true, force: true });
    }
    this.ensureDirs();
  }

  public stats(): DiskCacheStats {
    const countFiles = (dir: string) => (existsSync(dir) ? readdirSync(dir).length : 0);
    return {
      modulesCount: countFiles(this.modulesDir),
      registryCount: countFiles(this.registryDir),
      binariesCount: countFiles(this.binariesDir),
      totalSizeBytes: 0,
    };
  }

  private hashString(str: string): string {
    return createHash("sha1").update(str).digest("hex");
  }
}

/** Global disk cache singleton */
export const diskCache = new PersistentDiskCache();

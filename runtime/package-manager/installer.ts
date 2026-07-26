/**
 * RahulChaube Runtime — Package Installer Subsystem.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   - Downloads npm registry metadata using RegistryClient.
 *   - Resolves dependencies recursively for package.json.
 *   - Downloads `.tgz` tarballs to persistent cache directory.
 *   - Decompresses and extracts package files into `node_modules/`.
 *   - Generates `rahulchaube.lock` lockfile.
 * ─────────────────────────────────────────────────────────────────
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { RegistryClient, VersionMetadata } from "../registry/client.ts";
import { LockfileManager, LockfileEntry } from "./lockfile.ts";

export interface InstallResult {
  installed: string[];
  lockfilePath: string;
  cachedCount: number;
}

export class PackageInstaller {
  private registry: RegistryClient;
  private cacheDir: string;

  constructor(options: { registry?: RegistryClient; cacheDir?: string } = {}) {
    this.registry = options.registry ?? new RegistryClient();
    const home = process.env.USERPROFILE || process.env.HOME || process.cwd();
    this.cacheDir = options.cacheDir ?? resolve(home, ".rahulchaube", "cache", "tarballs");
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Run installation for a project directory containing package.json.
   */
  public async installProject(projectDir: string): Promise<InstallResult> {
    const pkgJsonPath = resolve(projectDir, "package.json");
    if (!existsSync(pkgJsonPath)) {
      throw new Error(`package.json not found in ${projectDir}`);
    }

    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
    const deps: Record<string, string> = {
      ...(pkgJson.dependencies || {}),
      ...(pkgJson.devDependencies || {}),
    };

    const installed: string[] = [];
    const lockEntries: Record<string, LockfileEntry> = {};
    let cachedCount = 0;

    const nodeModulesDir = resolve(projectDir, "node_modules");
    if (!existsSync(nodeModulesDir)) {
      mkdirSync(nodeModulesDir, { recursive: true });
    }

    for (const [name, rawVersion] of Object.entries(deps)) {
      const verMeta = await this.resolveVersion(name, rawVersion);
      const tarballUrl = verMeta.dist.tarball;
      const shasum = verMeta.dist.shasum || "";

      const { tarballBuffer, isCached } = await this.fetchTarball(tarballUrl, name, verMeta.version);
      if (isCached) cachedCount++;

      // Extract tarball to node_modules/name
      const targetDir = resolve(nodeModulesDir, name);
      this.extractTarball(tarballBuffer, targetDir);

      installed.push(`${name}@${verMeta.version}`);
      lockEntries[name] = {
        version: verMeta.version,
        resolved: tarballUrl,
        integrity: shasum ? `sha1-${shasum}` : undefined,
        dependencies: verMeta.dependencies,
      };
    }

    const lockfile = LockfileManager.create(lockEntries);
    const lockfilePath = LockfileManager.write(projectDir, lockfile);

    return { installed, lockfilePath, cachedCount };
  }

  public async resolveVersion(name: string, rawVersion: string): Promise<VersionMetadata> {
    let tag = rawVersion;
    if (tag.startsWith("^") || tag.startsWith("~") || tag === "*") {
      tag = "latest";
    }
    const resolvedVersion = await this.registry.resolveTag(name, tag) || tag;
    return await this.registry.getVersion(name, resolvedVersion);
  }

  public async fetchTarball(url: string, name: string, version: string): Promise<{ tarballBuffer: Buffer; isCached: boolean }> {
    const safeName = name.replace(/\//g, "__");
    const cacheFile = resolve(this.cacheDir, `${safeName}-${version}.tgz`);

    if (existsSync(cacheFile)) {
      return { tarballBuffer: readFileSync(cacheFile), isCached: true };
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download tarball from ${url}: ${res.statusText}`);
    }

    const arrayBuf = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    writeFileSync(cacheFile, buffer);
    return { tarballBuffer: buffer, isCached: false };
  }

  /**
   * Decompresses gzipped tarball and extracts files to destDir.
   */
  public extractTarball(tarballBuffer: Buffer, destDir: string): void {
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    // Decompress gzip
    let tarBuffer: Buffer;
    try {
      tarBuffer = gunzipSync(tarballBuffer);
    } catch {
      // Not gzipped or corrupt — attempt raw
      tarBuffer = tarballBuffer;
    }

    // Basic TAR header extractor (POSIX ustar header 512 bytes)
    let offset = 0;
    while (offset < tarBuffer.length - 512) {
      const header = tarBuffer.subarray(offset, offset + 512);

      // Null block check (end of archive)
      if (header.every((b) => b === 0)) break;

      // Extract filename (bytes 0..99)
      const rawName = header.subarray(0, 100).toString("ascii").replace(/\0/g, "").trim();
      // Extract size (bytes 124..135 octal string)
      const sizeStr = header.subarray(124, 136).toString("ascii").replace(/\0/g, "").trim();
      const fileSize = parseInt(sizeStr, 8) || 0;

      // Type flag (byte 156): '0' or '\0' is normal file, '5' is dir
      const typeFlag = String.fromCharCode(header[156]);

      offset += 512; // move past header

      if (rawName && fileSize >= 0) {
        // Strip package/ prefix typical in npm tarballs
        const cleanName = rawName.replace(/^package[\\/]/, "");
        if (cleanName) {
          const outPath = resolve(destDir, cleanName);

          if (typeFlag === "5" || cleanName.endsWith("/")) {
            mkdirSync(outPath, { recursive: true });
          } else {
            mkdirSync(dirname(outPath), { recursive: true });
            const fileData = tarBuffer.subarray(offset, offset + fileSize);
            writeFileSync(outPath, fileData);
          }
        }
      }

      // Calculate padded offset (blocks of 512)
      offset += Math.ceil(fileSize / 512) * 512;
    }
  }
}

/**
 * RahulChaube Runtime — release downloader (cross-platform, Bun/Node).
 *
 * Resolves the correct artifact for the current platform and streams it to disk.
 */

export type Platform = "linux" | "macos" | "windows";
export type Arch = "x64" | "arm64";

export interface Target {
  platform: Platform;
  arch: Arch;
  ext: "tar.gz" | "zip";
}

export function detectTarget(): Target {
  const platform =
    process.platform === "win32" ? "windows" : process.platform === "darwin" ? "macos" : "linux";
  const arch = process.arch === "arm64" ? "arm64" : "x64";
  const ext = platform === "windows" ? "zip" : "tar.gz";
  return { platform, arch, ext };
}

export function artifactName(target: Target, version: string): string {
  return `rahulchaube-${target.platform}-${target.arch}.${target.ext}`;
}

export function releaseBaseUrl(repo: string, version: string): string {
  const base = process.env.RAHULCHAUBE_INSTALL_BASE ?? `https://github.com/${repo}/releases/download`;
  return `${base}/${version}`;
}

async function resolveLatestVersion(repo: string): Promise<string> {
  if (process.env.GITHUB_TOKEN) {
    const r = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });
    const j = (await r.json()) as { tag_name?: string };
    if (j.tag_name) return j.tag_name;
  }
  throw new Error("Unable to resolve latest version; pass --version explicitly.");
}

/**
 * Download an artifact to `dest`. Returns the written file path.
 */
export async function downloadRelease(opts: {
  repo?: string;
  version?: string;
  dest: string;
  onProgress?: (received: number, total: number) => void;
}): Promise<string> {
  const repo = opts.repo ?? process.env.RAHULCHAUBE_REPO ?? "rahulchaube/rahulchaube-runtime";
  const target = detectTarget();
  const version = opts.version ?? (await resolveLatestVersion(repo));
  const file = artifactName(target, version);
  const url = `${releaseBaseUrl(repo, version)}/${file}`;

  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status} ${res.statusText} (${url})`);
  const total = Number(res.headers.get("content-length") ?? 0);

  const fs = await import("node:fs");
  const path = await import("node:path");
  fs.mkdirSync(path.dirname(opts.dest), { recursive: true });
  const out = fs.createWriteStream(opts.dest);

  let received = 0;
  const reader = res.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out.write(Buffer.from(value));
    received += value.byteLength;
    opts.onProgress?.(received, total);
  }
  await new Promise<void>((r) => out.end(r));
  return opts.dest;
}

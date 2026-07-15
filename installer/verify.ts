/**
 * RahulChaube Runtime — checksum verification.
 *
 * Supports both Node.js and Bun crypto APIs under the same interface.
 */

import { createHash } from "node:crypto";
import { readFileSync, existsSync, readFileSync as read } from "node:fs";

export async function sha256File(path: string): Promise<string> {
  if (existsSync(path) === false) throw new Error(`File not found: ${path}`);
  const buf = readFileSync(path);
  return createHash("sha256").update(buf).digest("hex");
}

/**
 * Verify `file` against a `.sha256` sidecar or an explicit expected hash.
 * Returns true when the digest matches.
 */
export async function verifyChecksum(file: string, expected?: string): Promise<boolean> {
  const actual = await sha256File(file);
  if (expected) return actual.toLowerCase() === expected.toLowerCase().trim().split(/\s+/)[0];

  const sidecar = `${file}.sha256`;
  if (!existsSync(sidecar)) {
    throw new Error(`No checksum provided and no sidecar found at ${sidecar}`);
  }
  const contents = read(sidecar, "utf8").trim().split(/\s+/)[0];
  return actual.toLowerCase() === contents.toLowerCase();
}

export function formatHash(hash: string): string {
  return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

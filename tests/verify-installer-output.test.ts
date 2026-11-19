import { expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { versionInfo } from "../website/lib/releases.ts";
import { GET as checksum } from "../website/app/api/checksum/route.ts";

test("Published digests and sizes describe every distributable archive", async () => {
  const { checksums } = await checksum().json();
  for (const name of Object.keys(checksums) as Array<keyof typeof versionInfo.sha256>) {
    const bytes = readFileSync(`dist/${name}`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(checksums[name]);
    expect(bytes).toHaveLength(versionInfo.sizes[name]);
    expect(execFileSync("git", ["hash-object", "--no-filters", `dist/${name}`], { encoding: "utf8" }).trim()).toBe(versionInfo.blobs[name]);
  }
});

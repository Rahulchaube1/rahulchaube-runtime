import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { versionInfo } from "../website/lib/releases.ts";
import { GET as checksum } from "../website/app/api/checksum/route.ts";

test("Published digests and sizes describe every distributable archive", async () => {
  const { checksums } = await checksum().json();
  for (const name of Object.keys(checksums) as Array<keyof typeof versionInfo.sha256>) {
    const bytes = readFileSync(`dist/${name}`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(checksums[name]);
    expect(bytes.length).toBe(versionInfo.sizes[name]);
    expect(createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex")).toBe(versionInfo.blobs[name]);
  }
});

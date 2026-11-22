import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RELEASE_TARGETS } from "../installer/build-release.ts";

export function nativeFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "rahul-native-packaging-"));
  for (const t of RELEASE_TARGETS) {
    const dir = join(root, "native-" + t.name);
    mkdirSync(dir);
    writeFileSync(join(dir, t.isZip ? "rc.exe" : "rc"), t.name + "/rc");
  }
  return root;
}

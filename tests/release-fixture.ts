import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RELEASE_TARGETS } from "../installer/build-release.ts";

export function nativeFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "rahul-native-packaging-"));
  for (const t of RELEASE_TARGETS) {
    const dir = join(root, "native-" + t.name);
    mkdirSync(dir);
    for (const tool of ["blyxc", "rahulchaube-native", "rc"]) {
      writeFileSync(join(dir, tool + (t.isZip ? ".exe" : "")), t.name + "/" + tool);
    }
  }
  return root;
}

import { test, expect } from "bun:test";
import { PermissionManager, PermissionDeniedError } from "../runtime/permissions/index.ts";
import {
  PermissionedFS,
  PermissionedEnv,
  PermissionedNet,
  PermissionedProcess,
} from "../runtime/permissions/enforcement.ts";

test("Enforcement FS: throws PermissionDeniedError when read is denied", () => {
  const pm = new PermissionManager({ read: "deny-all" });
  const pfs = new PermissionedFS(pm);

  expect(() => pfs.readFileSync("package.json")).toThrow(PermissionDeniedError);
});

test("Enforcement FS: succeeds when read permission is granted", () => {
  const pkgPath = "packages/rahulchaube-cli/package.json";
  const pm = new PermissionManager({ read: [pkgPath] });
  const pfs = new PermissionedFS(pm);

  const content = pfs.readFileSync(pkgPath, "utf-8");
  expect(content).toContain("rahulchaube");
});

test("Enforcement FS: throws PermissionDeniedError when write is denied", () => {
  const pm = new PermissionManager({ write: "deny-all" });
  const pfs = new PermissionedFS(pm);

  expect(() => pfs.writeFileSync("test.tmp", "data")).toThrow(PermissionDeniedError);
});

test("Enforcement Env: throws PermissionDeniedError when env access denied", () => {
  const pm = new PermissionManager({ env: "deny-all" });
  const penv = new PermissionedEnv(pm);

  expect(() => penv.get("PATH")).toThrow(PermissionDeniedError);
});

test("Enforcement Net: throws PermissionDeniedError when network host denied", async () => {
  const pm = new PermissionManager({ net: ["api.example.com"] });
  const pnet = new PermissionedNet(pm);

  await expect(pnet.fetch("https://forbidden-site.org")).rejects.toThrow(PermissionDeniedError);
});

test("Enforcement Process: throws PermissionDeniedError when run command denied", () => {
  const pm = new PermissionManager({ run: "deny-all" });
  const pproc = new PermissionedProcess(pm);

  expect(() => pproc.execSync("echo test")).toThrow(PermissionDeniedError);
});

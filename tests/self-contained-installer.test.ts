import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { versionInfo } from "../website/lib/releases.ts";

test("Install the archive, run the packaged CLI, and preserve the install on checksum failure", async () => {
  const dir = mkdtempSync(join(tmpdir(), "rahul-install-test-"));
  const dest = join(dir, "install");
  let corrupt = false;
  const server = Bun.serve({
    hostname: "127.0.0.1", port: 0,
    fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/api/version") {
        return Response.json({ ...versionInfo, assets: Object.fromEntries(Object.entries(versionInfo.assets)
          .map(([key, asset]) => [key, url.origin + "/" + asset.split("/").pop()])) });
      }
      if (url.pathname.startsWith("/runtime-")) {
        return new Response(corrupt ? "incomplete download" : Bun.file(join("dist", url.pathname.slice(1))));
      }
      if (url.pathname === "/install-runtime.mjs") return new Response(Bun.file("website/public/install-runtime.mjs"));
      return new Response(null, { status: 404 });
    },
  });
  const windows = process.platform === "win32";
  const exe = windows ? "powershell" : "bash";
  const args = windows ? ["-NoProfile", "-File", "website/public/install.ps1"] : ["website/public/install.sh"];
  const install = () => Bun.spawn([exe, ...args], {
    env: { ...process.env, RAHULCHAUBE_INSTALL_DIR: dest, RAHULCHAUBE_INSTALL_ORIGIN: server.url.origin },
    stdout: "pipe", stderr: "pipe",
  });
  const launcher = join(dest, "bin", windows ? "rahulchaube.cmd" : "rahulchaube");
  const run = (args: string[]) => Bun.spawnSync(windows ? ["cmd", "/c", launcher, ...args] : [launcher, ...args], { cwd: dir });
  try {
    mkdirSync(join(dest, "cache"), { recursive: true });
    writeFileSync(join(dest, "cache", "keep"), "existing");
    const first = install();
    expect(await first.exited).toBe(0);
    expect(run(["--version"]).stdout.toString()).toContain(versionInfo.version);
    writeFileSync(join(dir, "hello.ts"), 'setTimeout(() => console.log(process.argv.slice(2).join("|")), 5);');
    const result = run(["run", "./hello.ts", "--", "--label=a=b", "hello"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString().trim()).toBe("--label=a=b|hello");
    expect(run(["run", "./missing.ts"]).exitCode).toBe(1);
    corrupt = true;
    const failed = install();
    expect(await failed.exited).not.toBe(0);
    expect(await new Response(failed.stderr).text()).toContain("SHA-256 mismatch");
    expect(readFileSync(join(dest, "cache", "keep"), "utf8")).toBe("existing");
    expect(run(["--help"]).exitCode).toBe(0);
  } finally {
    server.stop(true);
    rmSync(dir, { recursive: true, force: true });
  }
}, 30_000);

import { test, expect } from "bun:test";
import { GET } from "../website/app/api/download/route.ts";
import { getLatestRelease } from "../website/lib/releases.ts";

test("Download API resolves each platform, including Windows ZIPs, and rejects missing assets", () => {
  const get = (query: string) => GET(new Request("https://example.test/api/download?" + query));
  for (const asset of getLatestRelease().assets) {
    expect(get("platform=" + asset.target).headers.get("location")).toBe(asset.downloadUrl);
  }
  expect(get("platform=windows-x64").headers.get("location")).toEndWith("runtime-win-x64.zip");
  expect(get("platform=windows-arm64").status).toBe(404);
  expect(get("version=999").status).toBe(404);
});

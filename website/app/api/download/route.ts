import { getLatestRelease } from "../../../lib/releases";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const release = getLatestRelease();
  const platform = (searchParams.get("platform") ?? "linux-x64").replace(/^macos-/, "darwin-").replace(/^windows-/, "win-");
  const asset = release.assets.find(a => a.target === platform);
  if (!asset || (searchParams.get("version") ?? release.version).replace(/^v/, "") !== release.version) {
    return Response.json({ error: "Unknown release or platform" }, { status: 404 });
  }
  return Response.redirect(asset.downloadUrl, 307);
}

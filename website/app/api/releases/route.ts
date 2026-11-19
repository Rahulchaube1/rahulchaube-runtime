import { getLatestRelease } from "../../../lib/releases";
export function GET() {
  const { version, date, assets } = getLatestRelease();
  return Response.json({ latest: version, releases: [{
    version, releaseDate: date, status: "Stable", assets: assets.map(a => ({ os: a.os, arch: a.arch, file: a.filename })),
  }] });
}

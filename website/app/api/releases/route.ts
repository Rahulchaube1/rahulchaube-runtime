import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    latest: "1.0.0",
    releases: [
      {
        version: "1.0.0",
        releaseDate: "2026-07-25",
        status: "Stable Production",
        assets: [
          { os: "linux", arch: "x64", file: "rahulchaube-linux-x64.tar.gz" },
          { os: "linux", arch: "arm64", file: "rahulchaube-linux-arm64.tar.gz" },
          { os: "darwin", arch: "arm64", file: "rahulchaube-darwin-arm64.tar.gz" },
          { os: "darwin", arch: "x64", file: "rahulchaube-darwin-x64.tar.gz" },
          { os: "windows", arch: "x64", file: "rahulchaube-windows-x64.zip" },
          { os: "windows", arch: "arm64", file: "rahulchaube-windows-arm64.zip" }
        ]
      }
    ]
  });
}

import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") ?? "linux-x64";
  const version = searchParams.get("version") ?? "1.0.0";

  const targetUrl = `https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v${version}/rahulchaube-${platform}.tar.gz`;
  return NextResponse.redirect(targetUrl, { status: 307 });
}

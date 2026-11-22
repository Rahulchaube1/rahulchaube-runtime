import { versionInfo } from "../../../lib/releases";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "healthy",
    uptime: process.uptime(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    timestamp: new Date().toISOString(),
    service: "RC Runtime Platform API",
    version: versionInfo.version
  });
}

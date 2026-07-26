import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "RahulChaube Runtime",
    version: "1.0.0",
    releaseChannel: "stable",
    build: "2026.07.25",
    commit: "3421ece",
    engine: "V8/JSC Core",
  });
}

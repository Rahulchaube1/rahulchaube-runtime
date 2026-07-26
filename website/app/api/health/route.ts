import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "RahulChaube Runtime Platform API",
    version: "1.0.0"
  });
}

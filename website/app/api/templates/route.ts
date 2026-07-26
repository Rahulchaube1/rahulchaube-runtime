import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    templates: [
      { name: "react", description: "React 19 + TypeScript starter template" },
      { name: "next", description: "Next.js App Router starter template" },
      { name: "express", description: "Express.js REST server starter template" },
      { name: "hono", description: "Hono Web Framework starter template" }
    ]
  });
}

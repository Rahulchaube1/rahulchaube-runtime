import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    plugins: [
      { name: "rahulchaube-plugin-tailwind", version: "1.0.0", description: "Native TailwindCSS compilation plugin" },
      { name: "rahulchaube-plugin-prisma", version: "1.0.0", description: "Prisma ORM integration plugin" },
      { name: "rahulchaube-plugin-docker", version: "1.0.0", description: "Docker containerization helper plugin" }
    ]
  });
}

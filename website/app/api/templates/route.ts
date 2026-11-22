export function GET() {
  return Response.json({ templates: [{ name: "RC Web", command: "rc init hello", description: "TypeScript HTTP service with a route test" }] });
}

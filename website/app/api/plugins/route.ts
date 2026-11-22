import catalog from "../../../public/plugins.json";

export function GET() {
  return Response.json(catalog);
}

import { versionInfo } from "../../../lib/releases";
export function GET() { return Response.json(versionInfo); }

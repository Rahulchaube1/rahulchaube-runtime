import { versionInfo } from "../../../lib/releases";
export function GET() {
  return Response.json({ version: versionInfo.version, algorithm: "SHA-256", checksums: versionInfo.sha256 });
}

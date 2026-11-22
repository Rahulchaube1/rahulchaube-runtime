import { versionInfo } from "../../../lib/releases";

// Shell installers can parse this single tab-separated record without a JSON tool.
export function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("platform") ?? "";
  const url = Object.hasOwn(versionInfo.assets, target) && versionInfo.assets[target];
  if (!url) return new Response("Unsupported platform\n", { status: 404 });
  const filename = url.split("/").pop()! as keyof typeof versionInfo.sha256;
  return new Response([versionInfo.version, versionInfo.sha256[filename], url].join("\t") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

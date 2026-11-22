/**
 * RahulChaube Runtime — API route handlers.
 */
import manifest from "../../website/lib/release-manifest.json" with { type: "json" };
import catalog from "../../website/public/plugins.json" with { type: "json" };
import { issueAccessToken, json, text, unauthorized, type Ctx, type Handler } from "./middleware.ts";

const startedAt = Date.now();
export const metrics = {
  requests: 0,
  errors: 0,
};

export const health: Handler = (_ctx: Ctx) =>
  json({
    status: "ok",
    service: "rahulchaube-api",
    version: manifest.version,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  });

export const versionHandler: Handler = () => json({ ...manifest, engine: "QuickJS-NG" });

export const releasesHandler: Handler = () => json({
  latest: manifest.version,
  releases: [{ version: manifest.version, downloadUrl: manifest.release }],
});

export const downloadHandler: Handler = () => json({
  installScript: "curl -fsSL https://www.rahulchaube.space/install | bash",
  binaries: Object.fromEntries(Object.entries(manifest.assets).map(([key, url]) =>
    [key.replace("win-", "windows-").replace("-", "_"), url])),
});

export const checksumHandler: Handler = () => json({ version: manifest.version, checksums: manifest.sha256 });
export const pluginsHandler: Handler = () => json({ officialPlugins: catalog.plugins, libraries: catalog.libraries });
export const templatesHandler: Handler = () => json({ templates: ["RC Web"], command: "rc init hello" });

export const metricsHandler: Handler = (_ctx: Ctx) =>
  json({
    requests: metrics.requests,
    errors: metrics.errors,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  });

export const info: Handler = (_ctx: Ctx) =>
  json({
    name: "RahulChaube Runtime API",
    docs: "https://rahulchaube.space/api",
    openapi: "/api/openapi.json",
  });

export const issueToken: Handler = (ctx: Ctx) => {
  const token = issueAccessToken(ctx.req);
  return token ? json({ token, type: "Bearer", expiresIn: 900 }, 200, { "cache-control": "no-store" }) : unauthorized();
};

export const protectedResource: Handler = (ctx: Ctx) => {
  return text(`Authorized access for ${String(ctx.state.client ?? "client")}`);
};

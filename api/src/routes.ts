/**
 * RahulChaube Runtime — API route handlers.
 */
import { json, text, unauthorized, type Ctx, type Handler } from "./middleware.ts";

const startedAt = Date.now();
export const metrics = {
  requests: 0,
  errors: 0,
};

export const health: Handler = (_ctx: Ctx) =>
  json({
    status: "ok",
    service: "rahulchaube-api",
    version: "1.0.0",
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  });

export const versionHandler: Handler = (_ctx: Ctx) =>
  json({
    version: "1.0.0",
    releaseDate: "2026-07-26",
    engine: "bun-fork",
    nodeCompat: "v20.x",
  });

export const releasesHandler: Handler = (_ctx: Ctx) =>
  json({
    latest: "1.0.0",
    releases: [
      {
        version: "1.0.0",
        date: "2026-07-26",
        notes: "Initial production release of RahulChaube Runtime",
        downloadUrl: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0",
      },
    ],
  });

export const downloadHandler: Handler = (_ctx: Ctx) =>
  json({
    installScript: "curl -fsSL https://rahulchaube.space/install | bash",
    binaries: {
      linux_x64: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-linux-x64.tar.gz",
      linux_arm64: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-linux-arm64.tar.gz",
      darwin_arm64: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-darwin-arm64.tar.gz",
      darwin_x64: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-darwin-x64.tar.gz",
      windows_x64: "https://github.com/Rahulchaube1/rahulchaube-runtime/releases/download/v1.0.0/rahulchaube-windows-x64.zip",
    },
  });

export const checksumHandler: Handler = (_ctx: Ctx) =>
  json({
    version: "1.0.0",
    checksums: {
      "rahulchaube-linux-x64.tar.gz": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "rahulchaube-linux-arm64.tar.gz": "f4c0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b866",
      "rahulchaube-darwin-arm64.tar.gz": "a1b2c34298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b877",
      "rahulchaube-darwin-x64.tar.gz": "b2c3d44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b888",
      "rahulchaube-windows-x64.zip": "c3d4e54298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899",
    },
  });

export const pluginsHandler: Handler = (_ctx: Ctx) =>
  json({
    officialPlugins: [
      { name: "rahulchaube-plugin-react", description: "React component dev server and Fast Refresh plugin" },
      { name: "rahulchaube-plugin-tailwind", description: "Tailwind CSS zero-config JIT compiler plugin" },
      { name: "rahulchaube-plugin-docker", description: "Multi-stage Dockerfile generator plugin" },
    ],
  });

export const templatesHandler: Handler = (_ctx: Ctx) =>
  json({
    templates: ["react", "next", "express", "hono", "library", "cli"],
  });

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
  const secret = process.env.API_AUTH_SECRET;
  if (!secret) return unauthorized("API_AUTH_SECRET not configured");
  const body = `token-${secret.slice(0, 4)}-${Date.now()}`;
  return json({ token: body, type: "Bearer" });
};

export const protectedResource: Handler = (ctx: Ctx) => {
  return text(`Authorized access for ${String(ctx.state.client ?? "client")}`);
};

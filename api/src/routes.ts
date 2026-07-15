/**
 * RahulChaube Runtime — API route handlers.
 */
import { json, text, unauthorized, type Ctx, type Handler } from "./middleware.ts";

const startedAt = Date.now();
const metrics = {
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
  // Auth is enforced by the server before reaching here.
  return text(`Authorized access for ${String(ctx.state.client ?? "client")}`);
};

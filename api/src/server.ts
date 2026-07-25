/**
 * RahulChaube Runtime — API server.
 */

import {
  json,
  text,
  notFound,
  unauthorized,
  rateLimit,
  bearerAuth,
  clientIp,
  type Ctx,
  type Handler,
} from "./middleware.ts";
import {
  health,
  versionHandler,
  releasesHandler,
  downloadHandler,
  checksumHandler,
  pluginsHandler,
  templatesHandler,
  metricsHandler,
  info,
  issueToken,
  protectedResource,
  metrics,
} from "./routes.ts";
import { readFileSync } from "node:fs";

const PORT = Number(process.env.RAHULCHAUBE_API_PORT ?? 8787);
const LIMIT = Number(process.env.RAHULCHAUBE_API_RATE_LIMIT ?? 100);
const WINDOW = 60_000;

const limit = rateLimit(LIMIT, WINDOW);
const auth = bearerAuth("API_AUTH_SECRET");

type Route = { method: string; pattern: string; handler: Handler; secure?: boolean };

const ROUTES: Route[] = [
  { method: "GET", pattern: "/api", handler: info },
  { method: "GET", pattern: "/api/health", handler: health },
  { method: "GET", pattern: "/api/version", handler: versionHandler },
  { method: "GET", pattern: "/api/releases", handler: releasesHandler },
  { method: "GET", pattern: "/api/download", handler: downloadHandler },
  { method: "GET", pattern: "/api/checksum", handler: checksumHandler },
  { method: "GET", pattern: "/api/plugins", handler: pluginsHandler },
  { method: "GET", pattern: "/api/templates", handler: templatesHandler },
  { method: "GET", pattern: "/api/metrics", handler: metricsHandler },
  {
    method: "GET",
    pattern: "/api/openapi.json",
    handler: () => {
      const spec = JSON.parse(readFileSync(new URL("../openapi.json", import.meta.url), "utf8"));
      return json(spec);
    },
  },
  { method: "POST", pattern: "/api/auth/token", handler: issueToken },
  { method: "GET", pattern: "/api/protected", handler: protectedResource, secure: true },
];

function dispatch(req: Request): Response {
  const url = new URL(req.url);
  const ip = clientIp(req);
  const r = limit(ip);
  const headers: Record<string, string> = {
    "x-ratelimit-remaining": String(r.remaining),
    "x-ratelimit-reset": String(Math.ceil((r.reset - Date.now()) / 1000)),
  };
  if (!r.allowed) return json({ error: "Rate limit exceeded" }, 429, headers);

  const match = ROUTES.find((rt) => rt.method === req.method && rt.pattern === url.pathname);
  if (!match) return notFound();

  if (match.secure && !auth(req)) return unauthorized();

  metrics.requests++;
  const ctx: Ctx = { req, url, ip, state: {} };
  try {
    return match.handler(ctx);
  } catch (e) {
    metrics.errors++;
    return json({ error: (e as Error).message }, 500);
  }
}

async function start(): Promise<void> {
  const bunServe = (globalThis as any).Bun?.serve;
  if (typeof bunServe === "function") {
    bunServe({ port: PORT, fetch: dispatch });
    console.log(`[RahulChaube API] Listening on :${PORT} (limit ${LIMIT}/min, engine: bun)`);
    return;
  }

  // Node 18+ adapter: convert http req/res <-> Request/Response.
  const http = await import("node:http");
  const server = http.createServer(async (nodeReq: any, nodeRes: any) => {
    const chunks: Buffer[] = [];
    for await (const c of nodeReq) chunks.push(c);
    const body = Buffer.concat(chunks);
    const req = new Request(`http://${nodeReq.headers.host}${nodeReq.url}`, {
      method: nodeReq.method,
      headers: nodeReq.headers as any,
      body: body.length ? body : undefined,
    });
    const res = await dispatch(req);
    nodeRes.statusCode = res.status;
    res.headers.forEach((v: string, k: string) => nodeRes.setHeader(k, v));
    nodeRes.end(Buffer.from(await res.arrayBuffer()));
  });
  server.listen(PORT, () => {
    console.log(`[RahulChaube API] Listening on :${PORT} (limit ${LIMIT}/min, engine: node)`);
  });
}

start();

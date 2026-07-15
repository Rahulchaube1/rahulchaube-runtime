/**
 * RahulChaube Runtime — API middleware.
 *
 * Small, dependency-free middleware helpers built on the Web Standard
 * `Request`/`Response` model so the API runs on both Bun.serve and Node http.
 */

export interface Ctx {
  req: Request;
  url: URL;
  ip: string;
  state: Record<string, unknown>;
}

export type Handler = (ctx: Ctx) => Response | Promise<Response>;

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

export function text(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "text/plain" } });
}

export function notFound(msg = "Not found"): Response {
  return json({ error: msg }, 404);
}

export function unauthorized(msg = "Unauthorized"): Response {
  return json({ error: msg }, 401);
}

/** In-memory fixed-window rate limiter keyed by client IP. */
export function rateLimit(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>();
  return (ip: string): { allowed: boolean; remaining: number; reset: number } => {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now > entry.reset) {
      hits.set(ip, { count: 1, reset: now + windowMs });
      return { allowed: true, remaining: max - 1, reset: now + windowMs };
    }
    entry.count += 1;
    return { allowed: entry.count <= max, remaining: Math.max(0, max - entry.count), reset: entry.reset };
  };
}

/** Bearer-token authentication against an env-provided secret. */
export function bearerAuth(secretEnv = "API_AUTH_SECRET") {
  const secret = process.env[secretEnv];
  return (req: Request): boolean => {
    if (!secret) return true; // auth disabled when no secret configured
    const header = req.headers.get("authorization") ?? "";
    return header === `Bearer ${secret}`;
  };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

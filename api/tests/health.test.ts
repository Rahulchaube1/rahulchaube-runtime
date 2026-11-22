import { describe, it, expect } from "bun:test";
import { rateLimit, json, clientIp } from "../src/middleware.ts";

describe("middleware", () => {
  it("rateLimit allows up to max then blocks", () => {
    const limit = rateLimit(2, 1000);
    expect(limit("a").allowed).toBe(true);
    expect(limit("a").allowed).toBe(true);
    expect(limit("a").allowed).toBe(false);
  });

  it("json serializes with content-type", () => {
    const r = json({ ok: 1 });
    expect(r.headers.get("content-type")).toContain("application/json");
  });

  it("clientIp reads x-forwarded-for", () => {
    const req = new Request("http://x/", { headers: { "x-forwarded-for": "9.9.9.9, 1.1.1.1" } });
    expect(clientIp(req)).toBe("9.9.9.9");
  });
});

it("issues a usable short-lived credential to a configured API client", async () => {
  const { issueAccessToken, bearerAuth } = await import("../src/middleware.ts");
  const previous = process.env.API_AUTH_SECRET;
  try {
    process.env.API_AUTH_SECRET = crypto.randomUUID();
    const request = (token: string) => new Request("https://example.test/api", { headers: { authorization: "Bearer " + token } });
    const issued = issueAccessToken(request(process.env.API_AUTH_SECRET))!;
    expect(issued).toStartWith("rc1.");
    expect(bearerAuth()(request(issued))).toBe(true);
  } finally {
    if (previous === undefined) delete process.env.API_AUTH_SECRET;
    else process.env.API_AUTH_SECRET = previous;
  }
});

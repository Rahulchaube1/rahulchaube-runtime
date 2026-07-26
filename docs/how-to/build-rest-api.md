# How-to: Build a Production REST API

- **Category**: How-to Guides (Diátaxis)
- **Version**: v1.0.0
- **Last Updated**: 2026-07-26
- **Estimated Reading Time**: 8 minutes
- **Status**: Implemented

---

## Summary
Learn how to build, structure, and deploy a REST API microservice using RahulChaube Runtime and native Web Standard APIs.

---

## Overview
This guide demonstrates building a REST API endpoint router with JSON body handling, error catching, and rate limiting.

---

## Code Example: Production REST API Server (`api-server.ts`)

```typescript
// api-server.ts
interface User {
  id: string;
  name: string;
  email: string;
}

const users: Map<string, User> = new Map([
  ["1", { id: "1", name: "Rahul Chaube", email: "rahul@example.com" }]
]);

Bun.serve({
  port: 8080,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // GET /api/users
    if (req.method === "GET" && url.pathname === "/api/users") {
      return Response.json(Array.from(users.values()));
    }

    // POST /api/users
    if (req.method === "POST" && url.pathname === "/api/users") {
      try {
        const body = (await req.json()) as Omit<User, "id">;
        if (!body.name || !body.email) {
          return Response.json({ error: "Name and email required" }, { status: 400 });
        }
        const id = String(users.size + 1);
        const newUser: User = { id, name: body.name, email: body.email };
        users.set(id, newUser);
        return Response.json(newUser, { status: 201 });
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    }

    return Response.json({ error: "Route not found" }, { status: 404 });
  },
});

console.log("REST API Server running on http://localhost:8080");
```

---

## Running the API Server

```bash
rahulchaube run api-server.ts
```

---

## Testing Endpoints

```bash
# Get Users
curl http://localhost:8080/api/users

# Create User
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Developer", "email": "dev@example.com"}'
```

---

## Related Pages
- [Tutorial: First Steps](/docs/tutorials/first-steps)
- [Reference: API Specs](/docs/reference/api-reference)

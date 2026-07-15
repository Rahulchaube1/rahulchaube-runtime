import { Hono } from "hono";

const app = new Hono();

const routes = [
  { method: "GET", path: "/", description: "Health + metadata" },
  { method: "GET", path: "/users", description: "List users (placeholder)" },
];

app.get("/", (c) =>
  c.json({
    name: "rahulchaube-api-example",
    runtime: "RahulChaube Runtime",
    routes,
  }),
);

app.get("/users", (c) => c.json({ users: [] }));

export default app;

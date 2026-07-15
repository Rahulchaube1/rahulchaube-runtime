import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ name: "rahulchaube-hono-example", runtime: "RahulChaube Runtime" }));

export default app;

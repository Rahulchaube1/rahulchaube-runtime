function createHono() {
  const routes: any[] = [];
  return {
    get(path: string, handler: Function) {
      routes.push({ path, handler });
    },
    fetch(req: any) {
      const route = routes.find((r) => r.path === req.path);
      if (!route) return { status: 404, body: "Not Found" };
      return { status: 200, body: route.handler() };
    }
  };
}

const app = createHono();
app.get("/api/v1/status", () => ({ status: "online", framework: "Hono" }));
console.log(JSON.stringify(app.fetch({ method: "GET", path: "/api/v1/status" })));

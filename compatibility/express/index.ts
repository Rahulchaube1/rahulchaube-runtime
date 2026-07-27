function createExpressApp() {
  const routes: any[] = [];
  return {
    get(path: string, handler: Function) {
      routes.push({ method: "GET", path, handler });
    },
    handle(req: any) {
      const route = routes.find((r) => r.method === req.method && r.path === req.url);
      if (!route) return { statusCode: 404, body: { error: "Not Found" } };
      return { statusCode: 200, body: route.handler(req) };
    }
  };
}

const app = createExpressApp();
app.get("/health", () => ({ status: "ok", framework: "Express" }));
console.log(JSON.stringify(app.handle({ method: "GET", url: "/health" })));

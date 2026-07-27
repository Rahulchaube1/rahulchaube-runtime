function createElysia() {
  const routes = new Map();
  return {
    get(path: string, handler: Function) {
      routes.set(path, handler);
      return this;
    },
    handle(path: string) {
      const fn = routes.get(path);
      if (!fn) return { status: 404, data: "Not Found" };
      return { status: 200, data: fn() };
    }
  };
}

const app = createElysia().get("/elysia/health", () => "Elysia Web Handler Active");
console.log(JSON.stringify(app.handle("/elysia/health")));

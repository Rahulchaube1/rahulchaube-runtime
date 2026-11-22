// RC Web passes plain request and response objects across the native HTTP host.
export const text = (body, status = 200) => ({
  status, headers: { "Content-Type": "text/plain; charset=utf-8" }, body: String(body),
});

export const json = (value, status = 200) => ({
  status, headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(value),
});

export function createApp() {
  const routes = [];
  function on(method, path, handler) {
    if (typeof path !== "string" || !path.startsWith("/") || typeof handler !== "function") {
      throw new TypeError("Expected a route path starting with / and a handler function");
    }
    routes.push({ method: method.toUpperCase(), parts: path.split("/"), handler });
    return app;
  }
  async function handle(request) {
    const parts = request.path.split("/");
    const method = request.method.toUpperCase();
    for (const route of routes) {
      if (route.method !== method || route.parts.length !== parts.length) continue;
      const params = Object.create(null);
      let matches = true;
      for (let i = 0; i < parts.length; i++) {
        const pattern = route.parts[i];
        if (pattern.startsWith(":") && parts[i]) {
          try { params[pattern.slice(1)] = decodeURIComponent(parts[i]); }
          catch { return text("Invalid path encoding", 400); }
        } else if (pattern !== parts[i]) { matches = false; break; }
      }
      if (matches) return await route.handler({ headers: {}, query: {}, body: "", ...request, params });
    }
    return text("Not found", 404);
  }
  const app = {
    on, get: (path, fn) => on("GET", path, fn), post: (path, fn) => on("POST", path, fn), handle,
    listen({ hostname = "127.0.0.1", port = 3000 } = {}) { return RC.listen(hostname, port, handle); },
  };
  return app;
}

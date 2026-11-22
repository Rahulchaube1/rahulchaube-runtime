// RC Web passes plain request and response objects across the native HTTP host.
export const text = (body, status = 200) => ({
  status, headers: { "Content-Type": "text/plain; charset=utf-8" }, body: String(body),
});

export const json = (value, status = 200) => ({
  status, headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(value),
});

function matchPath(pattern, parts, params) {
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i].startsWith(":") && parts[i]) {
      params[pattern[i].slice(1)] = decodeURIComponent(parts[i]);
    } else if (pattern[i] !== parts[i]) {
      return false;
    }
  }
  return true;
}

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
      try {
        if (!matchPath(route.parts, parts, params)) continue;
      } catch (error) {
        if (error instanceof URIError) return text("Invalid path encoding", 400);
        throw error;
      }
      return route.handler({ headers: {}, query: {}, body: "", ...request, params });
    }
    return text("Not found", 404);
  }
  const app = {
    on, get: (path, fn) => on("GET", path, fn), post: (path, fn) => on("POST", path, fn), handle,
    listen({ hostname = "127.0.0.1", port = 3000 } = {}) { return RC.listen(hostname, port, handle); },
  };
  return app;
}

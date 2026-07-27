function createFastify() {
  const schemaRoutes = new Map();
  return {
    route(url, handler) {
      schemaRoutes.set(url, handler);
    },
    inject(url) {
      const handler = schemaRoutes.get(url);
      if (!handler) return { statusCode: 404, payload: "404 Not Found" };
      return { statusCode: 200, payload: JSON.stringify(handler()) };
    }
  };
}

const fastify = createFastify();
fastify.route("/fastify/ping", () => ({ pong: true, framework: "Fastify" }));
console.log(fastify.inject("/fastify/ping").payload);

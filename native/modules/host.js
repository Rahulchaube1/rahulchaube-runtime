// Keep transport callbacks private to the VM owner. All application callbacks
// run on that thread, including handlers for concurrent HTTP requests.
(() => {
  const host = globalThis.__rcHost;
  delete globalThis.__rcHost;
  const routes = new Map();
  const format = item => {
    if (item instanceof Error) return String(item) + "\n" + (item.stack ?? "");
    if (typeof item === "object" && item !== null) {
      try { return JSON.stringify(item) ?? String(item); } catch { return String(item); }
    }
    return String(item);
  };
  const print = (err, args) => host.print(err, args.map(format).join(" "));
  globalThis.console = {
    log: (...args) => print(false, args), info: (...args) => print(false, args),
    warn: (...args) => print(true, args), error: (...args) => print(true, args),
  };
  globalThis.RC = Object.freeze({
    version: host.version, args: Object.freeze(host.args),
    readText: host.readText, writeText: host.writeText,
    listen(hostname, port, handler) {
      if (typeof hostname !== "string" || !Number.isInteger(port) || port < 0 || port > 65535 || typeof handler !== "function") {
        throw new TypeError("Expected a hostname, TCP port and request handler");
      }
      const { id, port: boundPort } = host.listen(hostname, port);
      routes.set(id, handler);
      return { port: boundPort, close() { if (routes.delete(id)) host.close(id); } };
    },
  });
  return {
    async dispatch(server, id, request) {
      try {
        const response = await routes.get(server)(request);
        host.respond(id, JSON.stringify(response));
      } catch (error) {
        console.error(error);
        host.respond(id, '{"status":500,"body":"Internal Server Error"}');
      }
    },
  };
})()

# RC Web

Import `createApp`, `json` and `text` from `rc:web`. Register routes before starting the server.

```ts
import { createApp, json } from "rc:web";

const app = createApp();
app.get("/hello/:name", ({ params }) => json({ hello: params.name }));
app.post("/echo", ({ body }) => json({ body }, 201));
const server = app.listen({ hostname: "127.0.0.1", port: 3000 });
```

Routes match in registration order. Use `app.on(method, path, fn)` for other methods. Route handlers may return promises. A request exposes its method, escaped path, decoded route parameters, query and header arrays, and a UTF-8 body. The host accepts text bodies up to 1 MiB. Responses have a status, headers and text body. A missing route returns 404. A handler error returns 500.

Use port 0 to request an available port and read `server.port`. Call `server.close()` to stop accepting connections. The default listener uses the loopback interface. Set the hostname to `0.0.0.0` to listen on all IPv4 interfaces.

## Testing a route


```ts
import { test, equal } from "rc:test";
import { app } from "./app";

test("greets Ada", async () => {
  const res = await app.handle({ method: "GET", path: "/hello/Ada" });
  equal(res.status, 200);
  equal(JSON.parse(res.body).hello, "Ada");
});
```

[Online guide](https://www.rahulchaube.space/docs/rc-web)

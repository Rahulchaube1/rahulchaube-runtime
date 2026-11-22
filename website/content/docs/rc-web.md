## Create a router

Import `createApp`, `json` and `text` from `rc:web`. Register routes before calling `listen`. The first matching method and path wins.

```ts
import { createApp, json, text } from "rc:web";

const app = createApp();
app.get("/hello/:name", ({ params }) => json({ hello: params.name }));
app.on("PUT", "/message", ({ body }) => text(body));
const server = app.listen({ hostname: "127.0.0.1", port: 0 });
console.log("Listening on", server.port);
```

## Methods

| Method | Result |
| --- | --- |
| `app.get(path, handler)` | Register a GET route and return the app. |
| `app.post(path, handler)` | Register a POST route and return the app. |
| `app.on(method, path, handler)` | Register another HTTP method and return the app. |
| `app.handle(request)` | Return a response promise. Supply at least `method` and `path` to test a route directly. |
| `app.listen(options?)` | Start a listener and return its actual `port` and `close()` function. |

## Request fields

| Field | Shape |
| --- | --- |
| `method`, `path` | HTTP method and escaped URL path. |
| `params` | Decoded strings from named path segments such as `:name`. |
| `query` | Object with arrays of values for each query key. |
| `headers` | Lowercase header names mapped to arrays of strings. |
| `body` | Request body as text. Parse JSON explicitly when needed. |

When calling `handle` directly, provide `query` and `headers` separately from the path to exercise those fields. Handlers can be synchronous or async.

## Responses and errors

`text(value, status = 200)` and `json(value, status = 200)` set the response body and content type. A custom reply supplies a `status` from 200 to 599, a string `body` and optional string-valued `headers`. The HTTP host returns 404 for unmatched routes, 400 for invalid route-parameter encoding, 413 for request bodies over 1 MiB, and 500 if a handler throws.

## Listener lifecycle

The default is `127.0.0.1:3000`. Port `0` selects an available port. Read `server.port` after binding and call `server.close()` to stop accepting connections. Live HTTP requests have a 30-second handler deadline. [HTTP tutorial](/docs/how-to-build-rest-api)

## Build the entry file

From the tested `hello` project, bundle the server entry and its local imports.

```sh
rc build server.ts --outfile dist/server.mjs
```

The output is an ES module. Imports of built-in modules such as `rc:web` resolve against the installed RC executable when you run it.

## Run the artifact

First stop any earlier server listening on port 3000. Then start the bundle.

```sh
rc run dist/server.mjs
```

Request `http://127.0.0.1:3000/hello/Ada` to see `{"hello":"Ada"}`. Your `POST /greetings` route travels in this bundle too. For this starter, you can copy just `dist/server.mjs` into an empty directory on another supported machine with RC installed and run the same command with the new filename.

## Choose a listener address

`app.listen()` binds to loopback by default. For a service that must accept traffic on its network interface, choose an explicit address and port in `server.ts` and rebuild.

```ts
import { app } from "./app";

const server = app.listen({ hostname: "0.0.0.0", port: 8080 });
console.log("Listening on port", server.port);
```

A bundle includes imported code. Copy any data files the application opens at runtime separately. The course service has no such files. [Watch builds](/docs/watch-mode) · [Runtime architecture](/docs/architecture)

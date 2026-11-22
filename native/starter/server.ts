import { app } from "./app";
const server = app.listen({ port: 3000 });
console.log(`Listening on http://127.0.0.1:${server.port}`);

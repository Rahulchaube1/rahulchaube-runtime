import { createApp, json } from "rc:web";

export const app = createApp();
app.get("/", () => json({ runtime: "RC Runtime" }));
app.get("/hello/:name", ({ params }) => json({ hello: params.name }));

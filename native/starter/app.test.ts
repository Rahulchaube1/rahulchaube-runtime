import { equal, test } from "rc:test";
import { app } from "./app";

test("greets a visitor by name", async () => {
  const response = await app.handle({ method: "GET", path: "/hello/Rahul" });
  equal(response.status, 200);
  equal(JSON.parse(response.body).hello, "Rahul");
});

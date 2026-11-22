import { equal, test } from "rc:test";
import { greet, sum } from "./src/index";

test("exports a greeting and a variadic sum", () => {
  equal(greet("Ada"), "Hello, Ada! — powered by RC Runtime");
  equal(sum(10, 20, 12), 42);
});

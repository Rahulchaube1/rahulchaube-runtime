import { test, expect } from "bun:test";
import { WorkerPool, TaskQueue } from "../runtime/concurrency/worker-pool.ts";

test("TaskQueue: enqueue and steal tasks", () => {
  const q = new TaskQueue();
  expect(q.size()).toBe(0);

  q.enqueue({ id: 1, taskType: "transpile", payload: {}, resolve: () => {}, reject: () => {} });
  expect(q.size()).toBe(1);

  const stolen = q.steal();
  expect(stolen?.id).toBe(1);
  expect(q.size()).toBe(0);
});

test("WorkerPool: runs parallel transpilation across multiple files", async () => {
  const pool = new WorkerPool(4);
  expect(pool.getMaxWorkers()).toBe(4);

  const files = [
    { fileName: "a.ts", sourceText: "const a: number = 1;" },
    { fileName: "b.ts", sourceText: "const b: string = 'hello';" },
    { fileName: "c.ts", sourceText: "function c(n: number): number { return n; }" },
  ];

  const results = await pool.transpileParallel(files);

  expect(results.size).toBe(3);
  expect(results.get("a.ts")).toBe("const a = 1;");
  expect(results.get("b.ts")).toBe("const b = 'hello';");
  expect(pool.completedTaskCount).toBe(3);
});

test("WorkerPool: runs parallel dependency analysis", async () => {
  const pool = new WorkerPool(2);

  const files = [
    { fileName: "main.ts", sourceText: "import { a } from './a'; import { b } from './b';" },
    { fileName: "a.ts", sourceText: "import { c } from './c';" },
  ];

  const depsMap = await pool.analyzeDependenciesParallel(files);

  expect(depsMap.get("main.ts")).toEqual(["./a", "./b"]);
  expect(depsMap.get("a.ts")).toEqual(["./c"]);
});

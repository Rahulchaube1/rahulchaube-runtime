import { test, expect } from "bun:test";
import { RahulChaubeWorker } from "../runtime/worker/worker.ts";
import { writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const WORKER_SCRIPT_JS = resolve(process.cwd(), "tests/_tmp_worker.js");
const WORKER_SCRIPT_TS = resolve(process.cwd(), "tests/_tmp_worker.ts");

test("Worker: JS Worker receives postMessage and replies", async () => {
  writeFileSync(WORKER_SCRIPT_JS, `
    globalThis.onmessage = (evt) => {
      globalThis.postMessage({ echo: evt.data.value * 2 });
    };
  `);

  const worker = new RahulChaubeWorker(WORKER_SCRIPT_JS);

  const reply = await new Promise((res) => {
    worker.onmessage = (evt: any) => {
      res(evt.data);
    };
    worker.postMessage({ value: 21 });
  });

  expect(reply).toEqual({ echo: 42 });
  await worker.terminate();

  if (existsSync(WORKER_SCRIPT_JS)) rmSync(WORKER_SCRIPT_JS);
});

test("Worker: TS Worker transpiles on-the-fly and runs", async () => {
  writeFileSync(WORKER_SCRIPT_TS, `
    interface InputMsg {
      num: number;
    }

    globalThis.onmessage = (evt: { data: InputMsg }) => {
      const result: number = evt.data.num + 10;
      globalThis.postMessage({ result });
    };
  `);

  const worker = new RahulChaubeWorker(WORKER_SCRIPT_TS);

  const reply = await new Promise((res) => {
    worker.onmessage = (evt: any) => {
      res(evt.data);
    };
    worker.postMessage({ num: 32 });
  });

  expect(reply).toEqual({ result: 42 });
  await worker.terminate();

  if (existsSync(WORKER_SCRIPT_TS)) rmSync(WORKER_SCRIPT_TS);
});

test("Worker: terminate() stops worker thread", async () => {
  writeFileSync(WORKER_SCRIPT_JS, `
    setInterval(() => {
      globalThis.postMessage({ tick: true });
    }, 10);
  `);

  const worker = new RahulChaubeWorker(WORKER_SCRIPT_JS);
  let ticks = 0;
  worker.onmessage = () => { ticks++; };

  await new Promise((r) => setTimeout(r, 35));
  const exitCode = await worker.terminate();
  expect(exitCode).toBeGreaterThanOrEqual(0);

  const ticksAfterTerminate = ticks;
  await new Promise((r) => setTimeout(r, 30));
  expect(ticks).toBe(ticksAfterTerminate);

  if (existsSync(WORKER_SCRIPT_JS)) rmSync(WORKER_SCRIPT_JS);
});

/**
 * RahulChaube Runtime — Compatibility Suite: Async, Promises & Event Loop (Tests 151–210).
 */
import { test, expect } from "bun:test";
import { EventEmitter } from "node:events";
import { TimerRegistry } from "../../runtime/scheduler/timers.ts";
import { MicrotaskQueue } from "../../runtime/scheduler/microtask.ts";

// 151-165. Promises & Async/Await
test("Async: Promise resolution and chain chaining", async () => {
  const p = Promise.resolve(10).then((n) => n * 2).then((n) => n + 5);
  const result = await p;
  expect(result).toBe(25);
});

test("Async: Promise.all concurrency", async () => {
  const p1 = Promise.resolve(1);
  const p2 = Promise.resolve(2);
  const p3 = Promise.resolve(3);
  const results = await Promise.all([p1, p2, p3]);
  expect(results).toEqual([1, 2, 3]);
});

test("Async: Promise.allSettled status tracking", async () => {
  const p1 = Promise.resolve("ok");
  const p2 = Promise.reject(new Error("failed"));
  const results = await Promise.allSettled([p1, p2]);

  expect(results[0].status).toBe("fulfilled");
  expect(results[1].status).toBe("rejected");
});

test("Async: Promise.race returns first resolved/rejected promise", async () => {
  const fast = new Promise((r) => setTimeout(() => r("fast"), 5));
  const slow = new Promise((r) => setTimeout(() => r("slow"), 100));
  const winner = await Promise.race([fast, slow]);
  expect(winner).toBe("fast");
});

test("Async: Promise.any returns first fulfilled promise", async () => {
  const fail = Promise.reject("err");
  const ok = new Promise((r) => setTimeout(() => r("success"), 5));
  const result = await Promise.any([fail, ok]);
  expect(result).toBe("success");
});

test("Async: async/await exception handling with try/catch", async () => {
  const throwingAsync = async () => {
    throw new Error("async failure");
  };

  let caught = false;
  try {
    await throwingAsync();
  } catch (err: any) {
    caught = true;
    expect(err.message).toBe("async failure");
  }
  expect(caught).toBe(true);
});

// 166-180. Timers & Scheduler
test("Scheduler: TimerRegistry setTimeout execution and clearing", async () => {
  const timers = new TimerRegistry();
  let fired = false;
  const id = timers.setTimeout(() => { fired = true; }, 10);
  expect(timers.activeCount()).toBe(1);

  await new Promise((r) => setTimeout(r, 25));
  expect(fired).toBe(true);
  expect(timers.activeCount()).toBe(0);
});

test("Scheduler: TimerRegistry setInterval recurring ticks", async () => {
  const timers = new TimerRegistry();
  let ticks = 0;
  await new Promise<void>((resolve) => {
    const id = timers.setInterval(() => {
      if (++ticks === 3) {
        timers.clear(id);
        resolve();
      }
    }, 10);
  });
  expect(ticks).toBe(3);
  expect(timers.activeCount()).toBe(0);
});

test("Scheduler: TimerRegistry setImmediate tick", async () => {
  const timers = new TimerRegistry();
  let executed = false;
  timers.setImmediate(() => { executed = true; });

  await new Promise((r) => setTimeout(r, 15));
  expect(executed).toBe(true);
});

// 181-195. Microtask Queue
test("Microtask: MicrotaskQueue FIFO execution", () => {
  const queue = new MicrotaskQueue();
  const list: number[] = [];

  queue.enqueue(() => { list.push(1); });
  queue.enqueue(() => { list.push(2); });
  queue.drain();

  expect(list).toEqual([1, 2]);
});

test("Microtask: MicrotaskQueue statistics tracking", () => {
  const queue = new MicrotaskQueue();
  queue.enqueue(() => {});
  queue.enqueue(() => {});
  queue.drain();

  const stats = queue.stats();
  expect(stats.enqueued).toBe(2);
  expect(stats.drained).toBe(2);
});

// 196-210. Events & EventEmitters
test("Events: EventEmitter addListener, emit, and removeListener", () => {
  const ee = new EventEmitter();
  let count = 0;
  const listener = (val: number) => { count += val; };

  ee.on("test", listener);
  ee.emit("test", 10);
  expect(count).toBe(10);

  ee.off("test", listener);
  ee.emit("test", 10);
  expect(count).toBe(10);
});

test("Events: EventEmitter once() listener fires only once", () => {
  const ee = new EventEmitter();
  let count = 0;

  ee.once("single", () => { count++; });
  ee.emit("single");
  ee.emit("single");

  expect(count).toBe(1);
});

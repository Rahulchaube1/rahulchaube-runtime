import { test, expect } from "bun:test";
import { HMREngine } from "../runtime/hmr/engine.ts";

test("HMREngine: preserves module state across reloads via dispose and data", () => {
  const hmr = new HMREngine();

  const srcV1 = `
    hot.dispose((data) => {
      data.counter = 42;
    });
    exports.count = (hot.data.counter || 0) + 1;
  `;

  // First execution simulation
  const ctx = hmr.createHotContext("app.ts");
  const modObj: any = { exports: {} };
  const fn1 = new Function("exports", "hot", srcV1);
  fn1(modObj.exports, ctx);

  expect(modObj.exports.count).toBe(1);

  // Reload simulation
  const stats = hmr.reloadModule("app.ts", srcV1);

  expect(stats.statePreserved).toBe(true);
  expect(stats.durationMs).toBeGreaterThanOrEqual(0);
});

test("HMREngine: triggers accept hook on hot reload", () => {
  const hmr = new HMREngine();
  let accepted = false;

  const ctx = hmr.createHotContext("component.ts");
  ctx.accept(() => { accepted = true; });

  // In reloadModule, if previous accept hook exists or new one is registered, it runs:
  const src = `
    exports.msg = "v2";
  `;

  hmr.reloadModule("component.ts", src);
  expect(accepted).toBe(true);
});

import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import manifest from "../app/manifest.ts";
import { site } from "../lib/site.ts";
import editor from "../../editors/vscode/package.json";

const asset = (file) => readFileSync(new URL("../public/" + file, import.meta.url));
const dimensions = (png) => [png.readUInt32BE(16), png.readUInt32BE(20)];

test("public brand assets and app manifests use the official RC logo exports", () => {
  const original = readFileSync(new URL("../../branding/logo.png", import.meta.url));
  expect(asset("logo.png")).toEqual(original);
  expect(dimensions(asset("rc-logo.png"))).toEqual([187, 162]);
  const published = JSON.parse(asset("site.webmanifest").toString("utf8"));
  const app = manifest();
  const palette = JSON.parse(readFileSync(new URL("../../branding/colors.json", import.meta.url), "utf8"));
  expect(published.icons).toEqual(app.icons);
  expect(published.theme_color).toBe(app.theme_color);
  expect(published.background_color).toBe(app.background_color);
  expect(app.theme_color).toBe(palette.dark.background);
  expect(app.theme_color).toBe("#0d1117");
  for (const { src, sizes } of published.icons) {
    const icon = asset(src.slice(1));
    expect(dimensions(icon).join("x")).toBe(sizes);
    expect(icon).toEqual(asset("icon-" + sizes.split("x")[0] + ".png"));
  }
  expect(asset("favicon-32x32.png")).toEqual(asset("rc-mark-32.png"));
  expect(asset("apple-touch-icon.png")).toEqual(asset("rc-mark-180.png"));
});

test("the editor download carries the published version, checksum and official icon", () => {
  expect(site.editorVersion).toBe(editor.version);
  expect(readFileSync(new URL("../../editors/vscode/icon.png", import.meta.url))).toEqual(asset("icon-192.png"));
  const filename = `rahulchaube-runtime-${editor.version}.vsix`;
  const digest = createHash("sha256").update(asset("extensions/" + filename)).digest("hex");
  expect(asset("extensions/SHA256SUMS").toString().split(/\r?\n/)).toContain(digest + "  " + filename);
});

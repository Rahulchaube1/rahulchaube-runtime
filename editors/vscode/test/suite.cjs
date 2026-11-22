const assert = require("node:assert/strict");
const { existsSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { setInterval: ticks } = require("node:timers/promises");
const vscode = require("vscode");

async function until(condition, description) {
  const end = Date.now() + 25000;
  for await (const check of ticks(50, condition)) {
    if (check()) return;
    if (Date.now() > end) throw new Error("Timed out waiting for " + description);
  }
}
async function run() {
  const dir = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const entry = join(dir, "entry & test.ts");
  const lib = join(dir, "value.ts");
  const marker = join(dir, "output.txt");
  writeFileSync(lib, "export const value = 1;");
  writeFileSync(entry, 'import {value} from "./value"; import {writeText} from "rc:fs"; writeText("output.txt", String(value));');
  const doc = await vscode.workspace.openTextDocument(entry);
  await vscode.window.showTextDocument(doc);
  const extension = vscode.extensions.getExtension("RahulChaube.rahulchaube-runtime");
  assert.ok(extension, "packaged extension is discovered");
  await extension.activate();
  const command = name => vscode.commands.executeCommand("rcRuntime." + name);
  const result = () => existsSync(marker) ? readFileSync(marker, "utf8") : "";
  const tasks = () => vscode.tasks.taskExecutions.filter(x => x.task.definition.type === "rahulchaube-runtime");
  const ended = vscode.tasks.onDidEndTaskProcess(event => {
    if (event.execution.task.definition.type === "rahulchaube-runtime") {
      console.log("RC Runtime task ended", event.execution.task.name, event.exitCode);
    }
  });
  async function exerciseLive(mode, value) {
    const stamp = "mode-" + mode;
    writeFileSync(lib, 'export const value = "' + stamp + '";');
    const execution = await command(mode);
    assert.equal(execution.task.definition.mode, mode);
    await until(() => tasks().length === 1 && result() === stamp, "first " + mode + " evaluation");
    writeFileSync(lib, "export const value = " + value + ";");
    await until(() => result() === value, "saved dependency to reload");
    await command("stop");
    await until(() => tasks().length === 0, "task termination");
  }
  try {
    await command("run");
    await until(() => result() === "1" && tasks().length === 0, "one-shot run to finish");
    await exerciseLive("watch", "2");
    writeFileSync(entry, 'import {test} from "rc:test"; import {writeText} from "rc:fs"; test("editor", () => writeText("output.txt", "tested"));');
    await command("test");
    await until(() => result() === "tested" && tasks().length === 0, "file test to finish");
  } finally {
    ended.dispose();
    for (const task of tasks()) task.terminate();
  }
  console.log("RC Runtime packaged VSIX ran, watched, tested and stopped real tasks.");
}
module.exports = { run };

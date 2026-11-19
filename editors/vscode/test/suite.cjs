const assert = require("node:assert/strict");
const { existsSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const vscode = require("vscode");

async function until(condition, description) {
  const end = Date.now() + 25000;
  while (!condition()) {
    if (Date.now() > end) throw new Error("Timed out waiting for " + description);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
async function run() {
  const dir = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const entry = join(dir, "entry & test.ts");
  const lib = join(dir, "value.ts");
  const marker = join(dir, "output.txt");
  writeFileSync(lib, "export const value = 1;");
  writeFileSync(entry, 'import {value} from "./value"; import {writeFileSync} from "node:fs"; writeFileSync("output.txt", String(value));');
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
  try {
    await command("run");
    await until(() => result() === "1" && tasks().length === 0, "one-shot run to finish");
    for (const [mode, value] of [["watch", "2"], ["hot", "3"]]) {
      const execution = await command(mode);
      assert.equal(execution.task.definition.mode, mode);
      await until(() => tasks().length === 1, "live task");
      const previous = result();
      // Wait until the new process has executed the entry before changing an import.
      const stamp = "mode-" + mode;
      writeFileSync(lib, 'export const value = "' + stamp + '";');
      await until(() => result() === stamp && result() !== previous, "first evaluation");
      writeFileSync(lib, "export const value = " + value + ";");
      await until(() => result() === value, "saved dependency to reload");
      await command("stop");
      await until(() => tasks().length === 0, "task termination");
    }
  } finally {
    ended.dispose();
    for (const task of tasks()) task.terminate();
  }
  console.log("RC Runtime packaged VSIX ran, watched, hot reloaded and stopped real tasks.");
}
module.exports = { run };

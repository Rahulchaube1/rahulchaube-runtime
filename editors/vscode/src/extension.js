const vscode = require("vscode");
const path = require("node:path");
const { resolveRuntime, supportsFile } = require("./runtime");

const taskType = "rahulchaube-runtime";
const labels = { run: "Run", watch: "Watch", hot: "Hot reload" };

function activate(context) {
  const starting = new Set();
  const executions = () => vscode.tasks.taskExecutions.filter(x => x.task.definition.type === taskType);
  const updateContext = () => vscode.commands.executeCommand("setContext", "rcRuntime.running", executions().length > 0);

  async function launch(mode) {
    if (!vscode.workspace.isTrusted) return vscode.window.showInformationMessage("Trust this workspace to run RC Runtime.");
    const doc = vscode.window.activeTextEditor?.document;
    if (!doc || doc.isUntitled || !["file", "vscode-remote"].includes(doc.uri.scheme) || !supportsFile(doc.fileName)) {
      return vscode.window.showInformationMessage("Open a saved JavaScript or TypeScript file to run it with RC Runtime.");
    }
    const key = doc.uri.toString();
    if (starting.has(key) || executions().some(x => x.task.definition.file === key)) {
      return vscode.window.showInformationMessage("An RC Runtime task is already running for this file.");
    }
    starting.add(key);
    try {
      const config = vscode.workspace.getConfiguration("rcRuntime", doc.uri);
      let program;
      try { program = await resolveRuntime(config.get("executablePath")); }
      catch (error) {
        const action = await vscode.window.showErrorMessage(error.message, "Download RC Runtime", "Open Settings");
        if (action === "Download RC Runtime") await vscode.env.openExternal(vscode.Uri.parse("https://www.rahulchaube.space/download"));
        if (action === "Open Settings") await vscode.commands.executeCommand("workbench.action.openSettings", "rcRuntime.executablePath");
        return;
      }
      if (doc.isDirty && !await doc.save()) return;
      const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
      const args = ["run", ...(mode === "run" ? [] : ["--" + mode]), doc.fileName];
      const proc = new vscode.ProcessExecution(program, args, { cwd: folder?.uri.fsPath || path.dirname(doc.fileName) });
      const task = new vscode.Task({ type: taskType, file: key, mode }, folder || vscode.TaskScope.Global,
        labels[mode] + " " + path.basename(doc.fileName), "RC Runtime", proc, []);
      task.isBackground = mode !== "run";
      task.presentationOptions = { reveal: vscode.TaskRevealKind.Always, panel: vscode.TaskPanelKind.Dedicated, focus: false };
      return await vscode.tasks.executeTask(task);
    } catch (error) {
      await vscode.window.showErrorMessage("RC Runtime could not start the task. " + error.message);
    } finally { starting.delete(key); }
  }

  async function stop() {
    const tasks = executions();
    if (!tasks.length) return vscode.window.showInformationMessage("There are no running RC Runtime tasks.");
    const active = vscode.window.activeTextEditor?.document.uri.toString();
    let target = tasks.find(x => x.task.definition.file === active);
    if (!target && tasks.length === 1) target = tasks[0];
    if (!target) {
      const choice = await vscode.window.showQuickPick(tasks.map(x => ({
        label: x.task.name, description: vscode.Uri.parse(x.task.definition.file).fsPath, execution: x,
      })), { placeHolder: "Stop an RC Runtime task" });
      target = choice?.execution;
    }
    target?.terminate();
  }

  for (const mode of Object.keys(labels)) {
    context.subscriptions.push(vscode.commands.registerCommand("rcRuntime." + mode, () => launch(mode)));
  }
  context.subscriptions.push(vscode.commands.registerCommand("rcRuntime.stop", stop),
    vscode.tasks.onDidStartTask(updateContext), vscode.tasks.onDidEndTask(updateContext));
  void updateContext();
}
module.exports = { activate };

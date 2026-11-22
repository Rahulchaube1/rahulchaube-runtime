## Install the extension

Install the native RC executable first. Download the official VSIX from the [editor downloads](/download#vscode). In VS Code 1.85 or later, open Extensions, choose the actions menu, then **Install from VSIX**. Open a trusted local workspace containing your RC project.

## Run a saved file

Save a JavaScript or TypeScript file. Open the Command Palette and choose **RC Runtime: Run Current File**, **Watch Current File** or **Test Current File**. The test action runs the selected file through `rc test`. Choose **Stop Running Task** to end an active watch or server.

## Locate the executable

If VS Code cannot find RC, run `rc doctor` in a terminal. Set `rcRuntime.executablePath` to the absolute path to the executable in VS Code settings, for example the installed `bin/rc.exe` on Windows. Reopen the saved file and run the command again. [Installation](/docs/installation) · [Command reference](/docs/cli)

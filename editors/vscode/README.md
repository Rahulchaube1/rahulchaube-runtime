# RahulChaube Runtime for VS Code

Run, watch and hot reload JavaScript or TypeScript with **RC Runtime** from the editor. Output and errors appear in the integrated task terminal.

1. Install RahulChaube Runtime 1.2.0 or later and Bun on the machine where your workspace runs. [Runtime downloads](https://www.rahulchaube.space/download)
2. Open a saved JS, JSX, TS or TSX file in a trusted workspace.
3. Click the eye icon or choose **RC Runtime: Watch Current File**. Save a change in the entry file or an imported module to restart the app.

| Command | Behavior |
| --- | --- |
| **RC Runtime: Run Current File** | Starts the active file once. |
| **RC Runtime: Watch Current File** | Restarts the app with fresh process state after a saved module changes. |
| **RC Runtime: Hot Reload Current File** | Re-evaluates changed modules in the running process. Values stored on `globalThis` can survive reloads. |
| **RC Runtime: Stop Running Task** | Stops the task for the active file or lets you choose a running RC task. |

Commands save pending edits to the entry file before launch. The working directory is the containing workspace folder. Single-file windows use the file’s directory. The extension also supports MJS, CJS, MTS and CTS.

For a custom installation, set **RC Runtime: Executable Path** to the absolute path to the CLI. On Windows the standard native executable is under `%USERPROFILE%\.rahulchaube\packages\rahulchaube-cli\bin\rahulchaube-native.exe`.

Download the VSIX and use **Extensions: Install from VSIX…** for manual installation. [Editor downloads](https://www.rahulchaube.space/download#vscode)

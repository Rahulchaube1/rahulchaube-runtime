## Install the extension

Install the native RC executable on the machine that hosts the workspace and run `rc --version` there. Download the official VSIX, open the Extensions view, choose **Install from VSIX…** in its menu and select the downloaded file. Open a trusted workspace containing your RC project. The extension requires a workspace extension host compatible with VS Code 1.85 or later. [Download the extension and checksums](/download#vscode)

## Install from the command line

In the folder where you saved the VSIX, run the command for your editor.

| Editor | Install command |
| --- | --- |
| VS Code | `code --install-extension ./rahulchaube-runtime-1.1.1.vsix` |
| VSCodium | `codium --install-extension ./rahulchaube-runtime-1.1.1.vsix` |
| code-server | `code-server --install-extension ./rahulchaube-runtime-1.1.1.vsix` |

Run the same editor command with `--list-extensions --show-versions` to confirm installation. Look for `rahulchaube.rahulchaube-runtime@1.1.1`. To upgrade a manually installed copy, install the new VSIX. [Packaged releases on GitHub](https://github.com/Rahulchaube1/rahulchaube-runtime/releases)

## Run a saved file

Save a JavaScript or TypeScript file. Open the Command Palette and choose **RC Runtime: Run Current File**, **Watch Current File** or **Test Current File**. The test action runs the selected file through `rc test`. Choose **Stop Running Task** to end an active watch or server.

To try it, save this as `hello.ts`, run **RC Runtime: Run Current File** and look for `Hello, RC!` in the task terminal.

```ts
const name: string = "RC";
console.log(`Hello, ${name}!`);
```

## Locate the executable

If VS Code cannot find RC, run `rc doctor` in a terminal. Set `rcRuntime.executablePath` to the absolute path to the executable in VS Code settings, for example the installed `bin/rc.exe` on Windows. Reopen the saved file and run the command again. [Installation](/docs/installation) · [Command reference](/docs/cli)

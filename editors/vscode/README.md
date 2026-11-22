# RC Runtime for VS Code

Run, watch and test JavaScript or TypeScript from the editor using Rahul Chaube’s open-source RC Runtime.

## Install

1. Install RC Runtime 1.3 on the machine where your workspace runs. Open a terminal there and run `rc --version`. [Runtime downloads](https://www.rahulchaube.space/download)
2. Download the editor extension, open the Extensions view, select **Install from VSIX…** from its menu and choose the downloaded file. The same package works with desktop VS Code, VSCodium and code-server. [Official VSIX](https://www.rahulchaube.space/download#vscode)
3. Open a trusted workspace and save a JavaScript or TypeScript file. Open the Command Palette and choose **RC Runtime: Run Current File**.

The extension finds `rc` on PATH or under `~/.rc-runtime/bin`. For a custom installation, set `rcRuntime.executablePath` to its absolute path on the workspace host. [Editor guide](https://www.rahulchaube.space/docs/editor)

## Commands

| Command | Behavior |
| --- | --- |
| Run Current File | Runs the entry with `rc run`. |
| Watch Current File | Restarts on changes to the entry or its imports. |
| Test Current File | Runs the active file with `rc test`. |
| Stop Running Task | Stops the selected runtime task. |

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

### Rahul’s other projects

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).

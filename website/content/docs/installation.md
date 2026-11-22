## Choose a release

RC ships native binaries for Linux x64 and ARM64, macOS Intel and Apple Silicon, and Windows x64. Each archive includes the executable, MIT license and dependency notices. [Downloads and checksums](/download)

## Linux and macOS

Open a terminal with Bash and run the public installer.

```sh
curl -fsSL https://www.rahulchaube.space/install | bash
```

Open a new terminal. To use the default installation in the current shell immediately, run the following command.

```sh
export PATH="$HOME/.rc-runtime/bin:$PATH"
rc --version
```

## Homebrew

On macOS or Linux, add the project’s tap and install the native build for your processor.

```sh
brew tap rahulchaube1/rc-runtime https://github.com/Rahulchaube1/rahulchaube-runtime
brew install rahulchaube1/rc-runtime/rc-runtime
rc --version
```

To upgrade later, run `brew update` followed by `brew upgrade rc-runtime`.

## Windows

Open PowerShell on Windows x64 and run the installer. It verifies the archive with SHA-256 and adds the default executable directory to your user PATH.

```powershell
irm https://www.rahulchaube.space/install.ps1 | iex
rc --version
```

## Scoop

On Windows x64 with Scoop installed, add the project’s bucket and install RC.

```powershell
scoop bucket add rc-runtime https://github.com/Rahulchaube1/rahulchaube-runtime
scoop install rc-runtime/rc-runtime
rc --version
```

Run `scoop update` followed by `scoop update rc-runtime` to upgrade.

## WinGet local manifest

The source repository includes a WinGet manifest for Windows x64. With WinGet 1.28 or later, run the following from a checkout of RC Runtime. WinGet verifies the release archive and installs `rc.exe` for your user. [Manifest files](https://github.com/Rahulchaube1/rahulchaube-runtime/tree/main/packaging/winget/1.3.0)

```powershell
winget install --manifest .\packaging\winget\1.3.0 --scope user
rc --version
```

If WinGet reports that local manifests are disabled, enable them from an administrator terminal with `winget settings --enable LocalManifestFiles`, then run the install in your regular terminal.

## Custom or manual installation

To choose the destination, set `RC_INSTALL_DIR` in the installer environment. Add that destination’s `bin` directory to PATH yourself. To install manually, download your platform archive and compare its SHA-256 digest with the value on the [releases page](/releases) before extracting it. Run the executable under `bin`.

```sh
sha256sum runtime-linux-x64.tar.gz
```

On macOS use `shasum -a 256`. On Windows use `certutil -hashfile runtime-win-x64.zip SHA256`. Run `rc doctor` to confirm the selected executable. Re-run the installer to update to the current release.

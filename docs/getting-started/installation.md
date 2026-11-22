# Installation

The installer downloads the archive for your operating system, checks its SHA-256 digest and installs the release under ~/.rc-runtime. On Linux and macOS, use Bash.

```sh
curl -fsSL https://www.rahulchaube.space/install | bash
```

On Windows x64, use PowerShell.

```powershell
irm https://www.rahulchaube.space/install.ps1 | iex
```

Open a new terminal and check the executable.

```sh
rc --version
```



Archives cover Linux x64/ARM64, macOS Intel/Apple Silicon and Windows x64. The Download page lists direct archives and their digests.

[Online guide](https://www.rahulchaube.space/docs/installation)

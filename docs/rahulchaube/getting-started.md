# Getting started with RC Runtime

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



## Your first application

Create a TypeScript application, run its tests and start the HTTP server.

```sh
rc init hello
cd hello
rc test
rc run server.ts
```

Visit http://127.0.0.1:3000/hello/Rahul. The route responds with {"hello":"Rahul"}. Press Ctrl+C to stop the server.

[Online guide](https://www.rahulchaube.space/docs/getting-started)

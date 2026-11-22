# RC Runtime (RahulChaube Runtime)

RC Runtime is Rahul Chaube’s open-source JavaScript and TypeScript runtime. One native executable runs scripts, bundles modules, tests applications, and serves HTTP with RC Web. The release includes its JavaScript engine and TypeScript compiler. You can run `rc` on a machine without Node.js, npm, Bun, or a GitHub account.

[Website](https://www.rahulchaube.space/) · [Developer handbook](https://www.rahulchaube.space/docs) · [Learn RC](https://www.rahulchaube.space/learn) · [Downloads and SHA-256 checksums](https://www.rahulchaube.space/download) · [Benchmarks](https://www.rahulchaube.space/benchmarks) · [MIT license](LICENSE.md)

## Install

On Linux or macOS, run

```sh
curl -fsSL https://www.rahulchaube.space/install | bash
```

On Windows x64, open PowerShell and run

```powershell
irm https://www.rahulchaube.space/install.ps1 | iex
```

Open a new terminal and run `rc --version`. The installer verifies the archive before updating the release files under `~/.rc-runtime`. Archives are available for Linux x64/ARM64, macOS Intel/Apple Silicon and Windows x64.

## Build your first HTTP service

```sh
rc init hello
cd hello
rc test
rc run server.ts
```

Open `http://127.0.0.1:3000/hello/Rahul` to receive `{"hello":"Rahul"}`. The generated project includes TypeScript declarations for the host and library APIs. Routes are ordinary functions. You can test them by calling `app.handle()` or serve them through the native HTTP listener.

```ts
import { createApp, json } from "rc:web";

const app = createApp();
app.get("/hello/:name", ({ params }) => json({ hello: params.name }));
app.listen({ port: 3000 });
```

## Commands and libraries

| Command | What it does |
| --- | --- |
| `rc run app.ts -- one two` | Runs the program and exposes its arguments as `RC.args`. |
| `rc run --watch app.ts` | Restarts the app when the entry or one of its imports changes. |
| `rc build app.ts --outfile app.mjs` | Bundles imports into an ES module. Run it with `rc run app.mjs`. |
| `rc test` | Discovers `.test` and `.spec` files and reports failures with a nonzero exit code. |
| `rc init hello` | Creates a TypeScript HTTP application and its first test in a new directory. |
| `rc install` | Installs HTTPS ES modules pinned by SHA-256 in `rc.json`. |
| `rc install --offline` | Restores verified modules from the local cache. |
| `rc doctor` | Prints the installed engine, compiler, version and platform. |

The built-in libraries are `rc:web` for HTTP routing, `rc:test` for synchronous and asynchronous tests, and `rc:fs` for text and JSON files. Each ships inside the executable. [RC Web and library reference](https://www.rahulchaube.space/docs/rc-web) · [Pinned module guide](https://www.rahulchaube.space/docs/package-manager)

## Engines and compatibility

The RC host and CLI are written in Go. QuickJS-NG evaluates JavaScript through quickjs-go. esbuild compiles TypeScript and resolves module graphs, including local ESM, CommonJS and JSON imports. The native host provides timers, files and HTTP. Packages that require Node built-ins, native Node add-ons, browser APIs or Bun globals need a compatible host. TypeScript execution strips types. Use a separate type checker when you need type diagnostics.

Earlier releases of the `rahulchaube` CLI remain available to existing projects. RC uses the separate `rc` executable and installation directory. [Previous release](https://github.com/Rahulchaube1/rahulchaube-runtime/releases/tag/v1.2.0)

## Build from source

With Go 1.25 or newer and a C compiler installed, build and test the native executable from this repository.

```sh
cd native
go test ./...
go build -trimpath -ldflags="-s -w" -o rc .
./rc --version
```

The CI matrix builds and exercises the native binaries on each supported target. To reproduce the process benchmarks on Linux or macOS, install Python 3, Bun, Node.js 24+ and npm, then run `python3 benchmarks/compare.py --rc /path/to/rc` from the repository root. [CI](https://github.com/Rahulchaube1/rahulchaube-runtime/actions) · [Methodology](benchmarks/README.md)

## License

RC Runtime’s original code is MIT-licensed, copyright © 2026 Rahul Chaube. The distribution includes third-party license notices for its dependencies. [MIT license](LICENSE.md) · [Third-party notices](licenses) · [Contributing](community/CONTRIBUTING.md)

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

### Rahul’s other projects

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).

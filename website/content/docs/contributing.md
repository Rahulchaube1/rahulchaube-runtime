## Build the native executable

Install Go 1.25 or later, a C compiler and Git. Clone the public repository and enter the native host directory.

```sh
git clone https://github.com/Rahulchaube1/rahulchaube-runtime.git
cd rahulchaube-runtime/native
go test ./...
go build -trimpath -o rc .
./rc --version
```

On Windows use `go build -trimpath -o rc.exe .` and `.\rc.exe --version`. The release workflow builds and exercises the supported native targets.

## Find the relevant source

The host and build pipeline are in `native/`. Built-in JavaScript modules live in `native/modules/`, and starter files and type declarations live in `native/starter/`. Website guide sources live in `website/content/docs/`.

## Contribute a change

Include the OS, `rc doctor` output, the command and a small ordinary example for a bug report. For a code change, describe what users will observe and how you tested it. Follow the project’s private reporting process for security issues. [Contribution guide](https://github.com/Rahulchaube1/rahulchaube-runtime/blob/main/community/CONTRIBUTING.md) · [Security policy](/security)

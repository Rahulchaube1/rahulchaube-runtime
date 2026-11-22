# Contributing to RC Runtime

The native host, CLI, RC Web and built-in libraries are developed in this public repository. Run the following from a clone with Go 1.25+ and a C compiler installed.

```sh
cd native
go test ./...
go build -trimpath -o rc .
./rc doctor
```

The starter is in `native/starter` and the built-in JavaScript libraries are under `native/modules`. The website uses Next.js in `website/`. To test the website from that directory, run `bun install --frozen-lockfile` and `bun run build`.

For a bug report, include the RC version, OS, input program, expected output and observed output. Pull requests should exercise the affected entry points. Contributions to RC Runtime are covered by the project’s MIT License. [License](../LICENSE.md)

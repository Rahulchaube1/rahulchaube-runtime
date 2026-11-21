# rahulchaube-cli

The user-facing command-line interface for **RahulChaube Runtime** — an
independent, MIT-licensed fork of Bun.

```sh
rahulchaube --help
```

## Execution

The release launcher is compiled from `blyx/main.blyx`. It handles flags, help, version, package commands, tests, builds and script dispatch. JS and TS files run in JavaScriptCore through Bun. Watch mode, debug mode and the other compatibility commands use the TypeScript implementation in `src/`.

The bundled Blyx compiler can interpret portable programs and build standalone executables. Native compilation requires Rust and a host linker. An installed user can run `rahulchaube blyx --help` to inspect the compiler commands.

## Development

From the repository root, install the compiler revision used by CI and build the launcher for your host OS.

```sh
cargo install --locked --git https://github.com/Rahulchaube1/blyxxxx --rev 2b6bd149ee898e05bb4b4e7f87e392baa7786071 blyxc
bun installer/build-native.ts "$(command -v blyxc)" packages/rahulchaube-cli/bin
packages/rahulchaube-cli/bin/rahulchaube-native --help
RAHUL_TEST_NATIVE=1 bun test tests/native-cli.test.ts
```

On Windows, pass the path to blyxc.exe and run rahulchaube-native.exe. The build embeds help and version from the CLI package and places the compiler beside the launcher.

Run `bun run typecheck` from this package to check the TypeScript compatibility layer. The five-platform CI matrix produces the native inputs for `bun installer/build-release.ts`.

## License

MIT. This is a fork of Bun; all upstream copyright notices and licenses are
preserved. Not affiliated with or endorsed by the Bun authors.

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).

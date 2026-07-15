# Contributing to RahulChaube Runtime

Thank you for your interest in contributing! This guide covers how to get
involved.

## Ways to contribute

- Report bugs and request features via GitHub Issues.
- Improve documentation in `docs/rahulchaube/` and `website/`.
- Build examples in `examples/` and templates in `templates/`.
- Submit pull requests for the CLI (`packages/rahulchaube-cli`) and ecosystem
  apps (`website/`, `api/`, `installer/`).

## Development setup

```sh
git clone <your-fork-url>
cd rahulchaube
rahulchaube install
```

### CLI (TypeScript)

```sh
cd packages/rahulchaube-cli
bun run start --help
bun run typecheck
```

### Website (Next.js)

```sh
cd website
npm install
npm run dev
```

### API

```sh
cd api
bun run dev
```

## Before opening a PR

- Run the relevant type checks and linters.
- Keep changes focused and add tests where practical.
- Update documentation for any user-facing change.
- Ensure `rahulchaube doctor` passes in your environment.

## License

By contributing, you agree that your contributions are licensed under the
**MIT License**. The project is a fork of Bun; do not remove or alter upstream
copyright notices or license headers.

## Attribution

RahulChaube Runtime is an independent fork of Bun. Retain all upstream
attribution and the original MIT license terms.

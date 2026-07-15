# Getting Started

Welcome to **RahulChaube Runtime** — a fast JavaScript & TypeScript runtime and
developer platform. This guide gets you from zero to a running app in under a
minute.

> RahulChaube Runtime is an independent, MIT-licensed fork of Bun. It is not
> affiliated with or endorsed by the Bun authors.

## 1. Install

```sh
npm install -g rahulchaube-cli
rahulchaube --version
```

## 2. Create a project

Pick a template and scaffold instantly:

```sh
rahulchaube create react my-app
rahulchaube create next my-app
rahulchaube create express my-app
rahulchaube create hono my-app
rahulchaube create library my-lib
rahulchaube create cli my-tool
```

The generator is interactive — run `rahulchaube create` with no arguments to
choose a template and name interactively.

## 3. Install dependencies

```sh
cd my-app
rahulchaube install
```

You get a colorful, progress-aware install experience with a lockfile
(`bun.lock`, engine-compatible) for reproducible installs.

## 4. Run it

```sh
rahulchaube run dev
```

TypeScript, JSX, and modern syntax work out of the box — no config required.

## 5. Test & build

```sh
rahulchaube test                 # run the test suite
rahulchaube build --minify --sourcemap   # bundle for production
rahulchaube benchmark            # measure performance
```

## Next steps

- [Installation guide](./installation.md)
- [Migration guide](./migration-guide.md)
- [Performance guide](./performance-guide.md)
- [Architecture guide](./architecture-guide.md)
- [Plugin guide](./plugin-guide.md)

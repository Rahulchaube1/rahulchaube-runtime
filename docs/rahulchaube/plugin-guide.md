# Plugin Guide

RahulChaube Runtime has a stable plugin API for third-party extensions.

## Concepts

- A **plugin** is an npm package named `rahulchaube-plugin-<name>`.
- Plugins are stored in a managed directory (`~/.rahulchaube/plugins`) and can
  also be installed globally via the engine.
- Plugins extend the CLI with new commands or augment existing workflows.

## Managing plugins

```sh
rahulchaube plugins install my-plugin     # installs rahulchaube-plugin-my-plugin
rahulchaube plugins list                  # list installed plugins
rahulchaube plugins update                # update all plugins
rahulchaube plugins update my-plugin      # update a specific plugin
rahulchaube plugins remove my-plugin      # remove a plugin
```

## Writing a plugin

Create a package `rahulchaube-plugin-hello`:

```jsonc
// package.json
{
  "name": "rahulchaube-plugin-hello",
  "version": "1.0.0",
  "type": "module",
  "main": "index.ts",
  "rahulchaube": {
    "command": "hello",
    "description": "Prints a friendly greeting"
  }
}
```

```ts
// index.ts
import { log, colors, brand } from "rahulchaube-cli/ui";

export default function hello(args: string[]) {
  log.success(`Hello from ${brand("RahulChaube")} plugin! ${args.join(" ")}`);
  return 0;
}
```

Install it locally for development:

```sh
rahulchaube plugins install ./rahulchaube-plugin-hello
```

## Plugin manifest

Each plugin may declare metadata under a `rahulchaube` key in its
`package.json`:

| Field | Description |
| --- | --- |
| `command` | The subcommand name exposed on the CLI |
| `description` | Short help text |
| `hooks` | Lifecycle hooks (e.g. `postinstall`, `prebuild`) |

## Security

Plugins run with the same privileges as the CLI. Only install plugins from
trusted sources, and review them with `rahulchaube audit` and
`rahulchaube licenses`.

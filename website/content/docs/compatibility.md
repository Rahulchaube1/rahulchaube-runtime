## Check a dependency

Pure JavaScript and TypeScript modules that use supported language features can run on RC. Packages already in a local `node_modules` tree can be bundled if their code fits those APIs. The pinned-module installer consumes bundled HTTPS ES modules.

| Your code uses | RC approach |
| --- | --- |
| File reads and writes | Import `rc:fs`. |
| HTTP request handlers | Register routes with `rc:web`. |
| Unit tests | Register cases with `rc:test`. |
| Node built-ins, native Node add-ons or Bun globals | Port the dependency or run it in its supported host. |
| Browser DOM APIs | Run that code in a browser. |

## Earlier CLI releases

Projects using the older `rahulchaube` command can keep their existing installation. The standalone executable is `rc` and installs under `.rc-runtime`. Start a new RC project beside the old one, move pure modules first, then adapt HTTP, files and tests. [Archived release v1.2.0](https://github.com/Rahulchaube1/rahulchaube-runtime/releases/tag/v1.2.0)

## Earlier CLI plug-ins

The earlier Bun-hosted CLI used its own plugin commands. Consult its tagged documentation when maintaining an older project. New RC projects extend applications with ordinary modules and the three built-in libraries. [Libraries](/docs/api) · [Install a module](/docs/package-manager)

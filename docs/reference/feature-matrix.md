# RC Runtime capabilities

| Capability | Native rc |
| --- | --- |
| JavaScript and TypeScript | QuickJS-NG evaluation and esbuild compilation |
| Module resolution | Static imports, literal dynamic imports, bundled CommonJS and JSON |
| Development | Watch and restart, bundle to ESM, scaffold an HTTP project |
| Built-in libraries | rc:web, rc:test, rc:fs |
| Package installation | Single-file HTTPS ES modules pinned by SHA-256, with an offline cache |
| Node APIs and native add-ons | Require a compatible host |

[Measured performance](https://www.rahulchaube.space/benchmarks)

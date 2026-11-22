## Choose a module

| Import | Use it to | Reference |
| --- | --- | --- |
| `rc:web` | Register HTTP routes, serve requests and return JSON or text. | [RC Web](/docs/rc-web) |
| `rc:test` | Register tests, compare values and assert conditions. | [Test API](/docs/rc-test) |
| `rc:fs` | Read or write UTF-8 text and JSON files. | [Filesystem API](/docs/rc-fs) |

These modules ship in the executable. Import them by their `rc:` names. Run application bundles that import these libraries with RC.

## Host globals

`RC.version` exposes the installed version string and `RC.args` holds the script’s argument list. The host also provides console output, timers, file access and a low-level listener. The starter’s `rc.d.ts` describes these interfaces for TypeScript editors. [JavaScript and TypeScript](/docs/runtime)

## Website endpoints

The public website exposes release metadata, installation records and archive checksums over HTTP. These endpoints are useful to release tooling and are separate from a program’s built-in modules. [Release HTTP API](/docs/website-api)

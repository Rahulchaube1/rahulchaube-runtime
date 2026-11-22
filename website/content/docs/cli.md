## Run a program

| Command | Behavior |
| --- | --- |
| `rc run <entry> [--] [args...]` | Execute a JS or TS file. The program reads trailing arguments from `RC.args`. |
| `rc run --watch <entry> [--] [args...]` | Recompile and restart after a successful edit. |

For example, `rc run hello.ts -- "two words" --verbose` passes two values into the program. Use a relative or absolute entry filename.

## Build and test

| Command | Behavior |
| --- | --- |
| `rc build <entry> --outfile <file>` | Write a bundled ES module to the supplied path. |
| `rc build --watch <entry> --outfile <file>` | Keep the output up to date as imports change. |
| `rc test [files...]` | Run named test files or discover tests below the current directory. |

A missing entry, compilation error, unhandled exception or failed test makes the command exit with a nonzero status. [Test discovery rules](/docs/rc-test)

## Manage a project

| Command | Behavior |
| --- | --- |
| `rc init <directory>` | Create a new directory with a typed HTTP app and tests. |
| `rc install` | Download and verify dependencies declared in the nearest `rc.json`. |
| `rc install --offline` | Reuse verified project or user-cache files. |

## Inspect the installation

`rc doctor` prints the version, OS, CPU architecture, engine and compiler. `rc --version` or `rc -v` prints the release number. `rc --help`, `rc -h` and `rc help` print the command list. Running `rc` by itself also prints help.

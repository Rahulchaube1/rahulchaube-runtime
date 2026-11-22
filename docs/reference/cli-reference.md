# CLI reference

- `rc run <entry> [--] [args...]` runs JS or TS. Read arguments from `RC.args`.
- `rc run --watch <entry>` restarts the application on change. `rc build --watch` keeps a bundle up to date.
- `rc build <entry> --outfile <file>` writes an ES module bundle.
- `rc init <new-directory>` generates a working RC Web application.
- `rc test [files...]` executes named files or discovers .test and .spec files recursively. Each file has its own VM.
- `rc install [--offline]` installs pinned, single-file ES modules declared in rc.json.
- `rc doctor` prints runtime and platform information.
- `rc --version` prints the installed release. `rc --help` lists the commands.

[Online guide](https://www.rahulchaube.space/docs/cli)

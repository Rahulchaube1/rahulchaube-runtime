## Install project dependencies

From a directory that contains an `rc.json` manifest, or a directory below it, run the installer.

```sh
rc install
```

Each dependency has a module name, an HTTPS URL and a lowercase SHA-256 digest. RC verifies the bytes before placing the module in the project and its user cache. Aliases with the same digest reuse one verified file. Up to four distinct modules can be fetched concurrently.

## Restore offline

```sh
rc install --offline
```

A verified local installation or a populated user cache is sufficient. A missing or damaged module causes a failure if it cannot be restored offline. An online download with the wrong digest also fails.

## Add a module

Use the copyable manifest and import example in the [package manager guide](/docs/package-manager). The distribution format is a bundled ES module. The digest pins its contents. [Publish a module](/docs/publishing-modules) · [Install the native executable](/docs/installation)

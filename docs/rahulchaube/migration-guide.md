# Migration Guide

Moving to RahulChaube Runtime from another tool? The `rahulchaube migrate`
command detects your current setup and adjusts your project for the new brand.

## From npm

```sh
rahulchaube migrate npm
```

- Removes `package-lock.json`.
- Creates `rahulchaube.json` with sensible defaults.
- Keeps your `package.json` scripts (they continue to work via `rahulchaube run`).

## From Yarn

```sh
rahulchaube migrate yarn
```

- Removes `yarn.lock`.
- Migrates workspaces to the engine-compatible lockfile.

## From pnpm

```sh
rahulchaube migrate pnpm
```

- Removes `pnpm-lock.yaml`.
- Flattens the strict `node_modules` layout to a compatible one.

## From Bun

```sh
rahulchaube migrate bun
```

- Rebrands the manifest and adds `rahulchaube.json`.
- Keeps the existing `bun.lock` (engine-compatible).

## Manual migration

1. Rename `bun.lock` references to keep it (it stays compatible).
2. Replace `bun` invocations in CI with `rahulchaube`.
3. Update `package.json` scripts:

```diff
- "dev": "bun --hot src/index.ts"
+ "dev": "rahulchaube run --hot src/index.ts"
```

4. Run `rahulchaube install` to regenerate the tree.

## CI/CD

GitHub Actions example:

```yaml
- uses: actions/setup-node@v4
- run: npm install -g rahulchaube-cli
- run: rahulchaube install
- run: rahulchaube test
```

## Notes on compatibility

RahulChaube Runtime is **API-compatible** with the upstream engine for runtime,
Node.js, and web-standard APIs. Existing code that runs on Bun runs unchanged.
The differences are purely the product name, CLI surface, and documentation.

# Governance

RahulChaube Runtime is an independent open-source project. This document
describes how decisions are made and how the project is maintained.

## Roles

| Role | Responsibility |
| --- | --- |
| **Maintainers** | Review and merge PRs, cut releases, triage issues. |
| **Contributors** | Submit PRs, report issues, improve docs and examples. |
| **Community** | Provide feedback, file issues, participate in discussions. |

## Decision making

- **Routine changes** (bug fixes, docs, examples) are merged by a maintainer
  after review.
- **Design decisions** (new commands, API changes, architecture) are discussed
  in a GitHub Issue with the `proposal` label and reach lazy consensus among
  maintainers.
- **Releases** are cut by a maintainer following the versioning policy below.

## Versioning

RahulChaube Runtime follows [Semantic Versioning](https://semver.org):

- **Major** — breaking changes to the CLI or public APIs.
- **Minor** — new, backward-compatible features.
- **Patch** — bug fixes and security updates.

## Becoming a maintainer

Contributors who demonstrate consistent, high-quality contributions and sound
judgment may be invited to become maintainers by existing maintainers.

## Fork attribution

RahulChaube Runtime is a fork of Bun (MIT). Maintainers are responsible for
preserving upstream copyright notices, license files, and attribution, and for
keeping the project clearly distinct from the official Bun project.

# Registry (Architecture Scaffold)

> **Status: scaffold only.** This directory documents the intended architecture
> for a future RahulChaube Runtime package registry. It is **not** a production
> registry and is intentionally minimal.

## Goals

A fast, secure registry for `rahulchaube add` and `rahulchaube install`, with:
- content-addressable storage,
- integrity verification,
- search,
- scoped access,
- horizontal scaling via workers.

## Layout

```
registry/
├── api/          # HTTP API (publish, fetch, metadata)
├── worker/       # Background jobs (indexing, virus scanning)
├── database/     # Metadata store (Postgres-compatible)
├── search/       # Full-text search index
├── storage/      # Artifact blob storage (S3-compatible)
└── docker/       # Container definitions
```

## API surface (planned)

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/-/package/:name` | Package metadata |
| `GET` | `/:name/-/:file` | Tarball download (verified by integrity) |
| `PUT` | `/:name` | Publish (auth required) |
| `GET` | `/-/search?q=` | Search |

See `registry/openapi.json` for the draft spec.

## Security

- Every artifact is content-hashed; clients verify `integrity` before use.
- Publishing requires signed tokens (mirrors the API `POST /api/auth/token`).
- Background scanning runs in `worker/` before an artifact becomes public.

This scaffold preserves the MIT license and does not create a competing official
registry; it is a reference design for self-hosting.

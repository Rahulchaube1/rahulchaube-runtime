# Templates

RahulChaube Runtime ships built-in project templates via
`rahulchaube create <template>`. They are defined in
`packages/rahulchaube-cli/src/commands/templates.ts` and mirrored here for
documentation and tooling.

| Template | Description | Entry |
| --- | --- | --- |
| `react` | Single-page React app with HMR | `src/main.tsx` |
| `next` | React with file-based pages | `src/pages/index.tsx` |
| `express` | HTTP server with Express | `src/index.ts` |
| `hono` | Lightweight edge-ready server | `src/index.ts` |
| `library` | Reusable TypeScript library | `src/index.ts` |
| `cli` | CLI compiled to a binary | `src/main.ts` |

See `templates.json` for the machine-readable manifest.

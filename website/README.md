# RC Runtime Website

The official website for RC Runtime, served at
[rahulchaube.space](https://rahulchaube.space).

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Icons:** lucide-react

## Pages

| Route | Description |
| --- | --- |
| `/` | Runtime overview, measured results and starter commands |
| `/download` | Installation commands and platform archives |
| `/docs` | Searchable handbook with grouped guides and API references |
| `/learn` | Five lessons with progress saved in the browser |
| `/blog` | Developer blog with RSS-style posts |
| `/benchmarks` | Measured startup, TypeScript, CPU, memory and executable size |
| `/roadmap` | Public roadmap with progress |

## Develop

```sh
bun install --frozen-lockfile
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
npm run lint
```

## Edit the handbook

Guide text lives in `content/docs/<slug>.md`. Register guides and lesson order in `lib/doc-catalog.ts`. Search, navigation, section outlines and the sitemap use the same guide sources. Run `bun test tests/handbook.test.mjs` from this directory to check the links and execute the documented course with the packaged RC binary.

## SEO

- `app/robots.ts` — robots.txt
- `app/sitemap.ts` — sitemap.xml
- `app/manifest.ts` — PWA manifest
- Open Graph + Twitter cards in `app/layout.tsx`

## Public data

The benchmark page and JSON read the same measurements. The installer and download cards use the release manifest generated from the platform archives. Vercel deploys the website from the repository’s main branch.

## License

RC Runtime is MIT-licensed. Release archives include third-party notices.

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

### Rahul’s other projects

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).

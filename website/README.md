# RahulChaube Runtime Website

The official website for RahulChaube Runtime, served at
[rahulchaube.space](https://rahulchaube.space).

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Icons:** lucide-react

## Pages

| Route | Description |
| --- | --- |
| `/` | CLI examples, developer resources, project templates |
| `/download` | Installation commands and platform archives |
| `/docs` | Documentation with sidebar (MDX-like content) |
| `/blog` | Developer blog with RSS-style posts |
| `/benchmarks` | Interactive charts (placeholder-labeled data) |
| `/roadmap` | Public roadmap with progress |

## Develop

```sh
bun install --frozen-lockfile
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## SEO

- `app/robots.ts` — robots.txt
- `app/sitemap.ts` — sitemap.xml
- `app/manifest.ts` — PWA manifest
- Open Graph + Twitter cards in `app/layout.tsx`

## Notes

- Benchmark charts render **only** clearly-labeled placeholder data until real
  measurements are published. The project does not claim to be faster than Bun
  or Node without evidence.
- This site is independent of the runtime; it can be deployed separately
  (Vercel, Cloudflare, Docker) and is not required to build the runtime.

## License

MIT. RahulChaube Runtime is an independent fork of Bun; upstream attribution
and license files are preserved.

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).

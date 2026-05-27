# Pro Portfolio

Interactive portfolio for Anurag Yadav: React/Vite homepage plus standalone HTML case studies in iframes.

## Structure

- `src/data/htmlProjects.ts` — homepage project cards (**auto-generated**; run extractor after HTML edits)
- `public/projects/Claude projects/` — eight live case-study HTML pages
- `src/data/fieldWork.ts` — EPC field stories (homepage modals)
- `src/components/` — homepage sections, navigation, footer
- `scripts/extract-html-projects.mjs` — regenerates `htmlProjects.ts` from HTML metadata
- `scripts/case-study/` — template + scaffold for new project pages (not deployed)

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

After changing project HTML ribbons, hero, or metrics:

```bash
node scripts/extract-html-projects.mjs
```

## Deploy on Vercel

1. Push to GitHub and import in the [Vercel dashboard](https://vercel.com/new), or use `npx vercel`.
2. Build: `npm run build` · output: `dist` (configured in `vercel.json`).
3. Client routes (`/project/:id`) rewrite to `index.html`; static files under `public/` are served as-is.

### Repo size

| Local | ~215 MB typical (`node_modules`, local `dist`) |
| GitHub / Vercel | ~**18–22 MB** tracked — `node_modules`, `dist`, `docs/`, `resumes/`, `Projects/` are gitignored |

Life gallery: `npm run life:compress` then `npm run life:thumbs` after adding paintings.

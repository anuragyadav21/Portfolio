# Pro-Portfolio — Claude Code Quick Reference

Auto-loaded at session start. Read this before touching anything.

## Stack & Dev Server

- **React + Vite + TypeScript** SPA at `src/`
- Dev: `npm run dev` → `localhost:5173` (launch config already in `.claude/launch.json`)
- Build: `npm run build` (tsc + vite → `dist/`)
- Project HTML files live in **`public/projects/Claude projects/`** — these are the main editing targets

## Critical File Map

| What you want to do | File(s) to open |
|---|---|
| Edit a project page | `public/projects/Claude projects/<name>.html` |
| Edit main portfolio layout | `src/components/` (Hero, ProjectsSection, etc.) |
| Edit project card data on homepage | `src/data/htmlProjects.ts` (**auto-generated** — run extractor; see below) |
| Add/remove a project from card grid | Run `node scripts/extract-html-projects.mjs` after editing the HTML |
| Change global styles | `src/styles.css` |
| Understand the HTML project template | `portfolio_page_framework.md` |
| Design/tone rules | `docs/portfolio-rulebook.md` |
| Project HTML structure & patterns | `ARCHITECTURE.md` |
| Current status of each file | `CURRENT_STATE.md` |
| CSS/JS patterns & common bugs | `KNOWN_PATTERNS.md` |

## The Most Important Rule

**`src/data/htmlProjects.ts` is auto-generated.** Never edit it by hand.
After changing a project HTML file's ribbon/metrics/eyebrow, run:
```
node scripts/extract-html-projects.mjs
```
This re-reads all `public/projects/Claude projects/*.html` files and regenerates the card metadata used on the homepage.

## Project HTML Pages (the main work surface)

All 8 project pages follow an identical three-layer pattern. See `KNOWN_PATTERNS.md` for the full breakdown.

| File | Course | Accent |
|---|---|---|
| `infra_scheduling_project_interactive.html` | SYSEN 5211 | amber (#8a4a1a) |
| `ivv_local_gemma_llm_project.html` | SYSEN 5400 | rust (#8b2218) |
| `llm_simulation_project.html` | SYSEN 5580 | cobalt (#1a3a5c) |
| `mbse_bus_shelter (1).html` | SYSEN (MBSE) | teal (#1a5c52) |
| `news_app_project (1).html` | SYSEN 5381 | cobalt (#1a3a5c) |
| `rag_lab_multimodal_project.html` | SYSEN 5400 | cobalt (#1a3a5c) |
| `ruga_project_v2 (3).html` | SYSEN 5400 | violet (#2a1a5c) |
| `turbine_digital_twin_project.html` | SYSEN 5490 | sage (#1a4a38) |

## React SPA Routes

- `/` → `Home` (all sections in one scroll)
- `/project/:id` → `ProjectPage` component → iframes the matching HTML file

## DO NOT

- Edit `src/data/htmlProjects.ts` by hand
- Edit `dist/` files — it's build output, always regenerated
- Add `box-shadow` anywhere — the design uses grid-gap + border-color, not shadows
- Use `border-radius > 4px` on cards
- Scan the full repo for patterns — check `KNOWN_PATTERNS.md` first

# Architecture Reference

## Directory Layout

```
Pro-Portfolio/
├── src/                          # React SPA source (Vite + TypeScript)
│   ├── App.tsx                   # Router: / → Home, /project/:id → ProjectPage
│   ├── main.tsx                  # Entry point
│   ├── styles.css                # Global CSS for the React SPA
│   ├── types.ts                  # Shared TypeScript types (Project, AudienceVariant)
│   ├── components/
│   │   ├── Nav.tsx               # Top nav bar
│   │   ├── Hero.tsx              # Landing hero with identity variants
│   │   ├── ProjectsSection.tsx   # Homepage project card grid (reads htmlProjects.ts)
│   │   ├── ProjectPage.tsx       # /project/:id route — renders an iframe of the HTML file
│   │   ├── ProjectEmbed.tsx      # Modal embed (legacy, for projects.ts modal pattern)
│   │   ├── FieldWorkSection.tsx
│   │   ├── WorkingSection.tsx    # "Cornell Changed Me" + "Why Fits" sections
│   │   ├── StackSection.tsx
│   │   ├── LifeOutsideEngineeringSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── Modal.tsx
│   │   ├── Footer.tsx
│   │   └── SectionHeader.tsx
│   ├── data/
│   │   ├── projects.ts           # Legacy React modal project data (3 entries use meta.ts)
│   │   ├── htmlProjects.ts       # AUTO-GENERATED — card metadata extracted from HTML files
│   │   ├── identityVariants.ts   # Audience-specific hero copy (?for= param)
│   │   ├── fieldWork.ts
│   │   ├── lifeOutsideEngineering.ts
│   │   └── stackLayers.ts
│   └── projects/                 # Legacy meta.ts files (used by projects.ts)
│       ├── llm-scheduling/meta.ts
│       ├── mbse/meta.ts
│       └── ruga/meta.ts
│
├── public/                       # Static assets — copied verbatim into dist/ at build
│   ├── assets/                   # Images (cornell-spotlight, etc.)
│   ├── outputs/figures/          # Plot PNGs for ivv_local_gemma project
│   ├── data/reference/innoslate/ # Diagrams for MBSE/V&V projects
│   └── projects/
│       └── Claude projects/      # *** PRIMARY EDIT TARGET ***
│           ├── *.html            # Self-contained project pages (8 files)
│           └── js/               # Shared JS for turbine digital twin
│               ├── app.js
│               ├── config.js
│               ├── dashboard.js
│               ├── datastore.js
│               ├── renderer.js
│               ├── turbinePhysics.js
│               └── windModel.js
│
├── scripts/
│   ├── extract-html-projects.mjs # Regenerates src/data/htmlProjects.ts from HTML files
│   ├── build_llm_experiments_from_csv.py  # Builds experiment data JSON for llm_simulation
│   └── generate_llm_experiment_data.py    # Generates synthetic experiment data
│
├── docs/
│   └── portfolio-rulebook.md     # Tone/content audit checklist — read before writing copy
│
├── dist/                         # Build output — never edit, always regenerated
├── Projects/                     # Source documents (docx, pdf, md) — reference only
├── portfolio_page_framework.md   # Full LLM prompt template for generating new project pages
├── CLAUDE.md                     # Session quick reference (auto-loaded by Claude Code)
├── ARCHITECTURE.md               # This file
├── CURRENT_STATE.md              # Per-file status snapshot
├── KNOWN_PATTERNS.md             # CSS/JS/HTML patterns and common bugs
├── package.json                  # npm scripts: dev, build, preview
├── vite.config.ts                # Vite config (minimal — just @vitejs/plugin-react)
└── tsconfig.json
```

---

## Data Flow: How Project Cards Get onto the Homepage

```
public/projects/Claude projects/*.html
        │
        │  node scripts/extract-html-projects.mjs
        ▼
src/data/htmlProjects.ts   (auto-generated, commit after running)
        │
        │  imported by
        ▼
src/components/ProjectsSection.tsx
        │
        │  rendered as
        ▼
Homepage project card grid  →  click  →  /project/:id  →  ProjectPage.tsx  →  <iframe src="...html">
```

**The iframe URL**: `ProjectPage.tsx` constructs the path as `/projects/Claude projects/${htmlFile}`.
Vite serves `public/` at root, so the HTML files are accessible at that path in dev and after build.

---

## Three-Layer HTML Project Architecture

Every project page in `public/projects/Claude projects/` follows this identical structure:

```
<body>
  <!-- LAYER 0: RIBBON — always visible -->
  <a class="ribbon" onclick="toggleLayer1(event)" id="ribbonEl">
    <span class="ribbon-tag">COURSE / SUBJECT / CODE</span>
    <div class="ribbon-title">Project Title</div>
    <div class="ribbon-sub">Course · Institution · Method</div>
    <div class="ribbon-metrics">  3 key numbers  </div>
    <span class="ribbon-caret" id="ribbonCaret">↓</span>
  </a>

  <!-- LAYER 1: Q&A OVERVIEW — hidden by default, .open shows it -->
  <div class="layer1" id="layer1">
    <div class="l1-hero">          2-column hero grid         </div>
    <!-- optional: app mock, mermaid diagram, figure -->
    <div class="qa-grid">          6–8 Q&A pairs              </div>
    <div class="l1-footer">
      <button onclick="toggleLayer2()">Full technical detail ↓</button>
    </div>
  </div>

  <!-- LAYER 2: FULL TECHNICAL DEEP-DIVE — hidden by default, .open shows it -->
  <div class="layer2" id="layer2">
    <nav class="l2-nav">           sticky section nav          </nav>
    <div class="l2-section" id="l2-intro">    ... </div>
    <div class="l2-section" id="l2-model">    ... </div>
    <!-- ... more sections ... -->
    <div class="conclusion-bar">   dark footer bar             </div>
  </div>

  <script>
    function toggleLayer1(e) { ... }
    function toggleLayer2() { ... }
    // IntersectionObserver scroll-spy for l2-nav active state
  </script>
</body>
```

**CSS rules that control visibility:**
```css
.layer1 { display: none; }
.layer1.open { display: block; }
.layer2 { display: none; }
.layer2.open { display: block; }
```

**Critical**: layer2 must be a sibling of layer1, NOT nested inside it. Both are direct children of `<body>`.

---

## Design System Tokens

```css
--ink:     #0f1820    /* dark background */
--ink2:    #1e2d3d
--paper:   #f6f2eb    /* warm off-white main bg */
--paper2:  #ede8df    /* slightly darker alternating */
--accent:  [per project — see CLAUDE.md table]
--accent2: [per project]
--gold:    #8a6a2e    /* timestamps, secondary labels */
--gold2:   #b08940    /* ribbon metric values */
--mist:    #6b8fa5    /* ribbon subtitle */
--text:    #1a2838
--text2:   #4a6070
--text3:   #7a92a5
--border:  rgba(15,26,34,.1)
--green:   #1b5c38
--red:     #8b2218
```

**Fonts** (Google Fonts, loaded in every project HTML):
- Headlines: `Playfair Display` serif
- Labels/monospace: `Source Code Pro`
- Body: `Libre Franklin`

---

## htmlProjects.ts Extraction Logic

`scripts/extract-html-projects.mjs` reads each HTML file and extracts:
- `id` — filename without extension (with spaces → `-`)
- `htmlFile` — original filename
- `tag` — from `.ribbon-tag` inner text
- `title` — from `.ribbon-title` inner text
- `sub` — from `.ribbon-sub` inner text
- `eye` — from `.l1-eyebrow` inner text
- `intro` — from `.l1-tagline` inner text (truncated)
- `metrics` — from `.rm-val` + `.rm-lbl` pairs (first 3)
- `featured` — true if eyebrow starts with `01`
- `sortIndex` — leading number in eyebrow string

**After any change to ribbon/eyebrow/tagline/metrics in a project HTML, run the extraction script.**

---

## Audience Variants

The homepage supports `?for=` query param:
- `?for=recruiter` — shows recruiter-optimized hero copy
- `?for=engineer` — shows engineer-optimized hero copy
- default — neutral/general copy

Logic is in `src/data/identityVariants.ts`.

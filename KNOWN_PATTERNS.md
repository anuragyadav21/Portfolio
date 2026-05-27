# Known Patterns & Common Bugs

Reference before writing or debugging any project HTML. Avoids re-discovering the same issues.

---

## HTML Structure Rules

### Layer containment — the #1 source of bugs

All `l2-section` divs **must be direct children of `#layer2`**. The most common failure mode is a stray extra `</div>` somewhere inside a section that prematurely closes the `layer2` container, causing sections from that point onward to render as direct `<body>` children — always visible, never hidden.

**How to diagnose:**
```js
// In browser console:
document.getElementById('l2-outputs').parentElement.id
// Should return "layer2". If it returns "" or undefined → escaped.
```

**How to find the stray tag:**
```python
# Count div opens vs closes in the segment between sections
segment = content[content.find('id="l2-prev-section"'):content.find('id="l2-this-section"')]
print(segment.count('<div'), segment.count('</div>'))
# If closes > opens, there's an extra </div> leaking out of layer2
```

**Fix:** Find the extra `</div>` — usually right before the next `<div class="l2-section">` — and delete it.

### Layer 1 vs Layer 2 relationship

```
<body>
  <a class="ribbon" ...>          <!-- Layer 0: always visible -->
  <div class="layer1" id="layer1"> <!-- Layer 1: hidden until ribbon click -->
  </div>
  <div class="layer2" id="layer2"> <!-- Layer 2: hidden until "Full technical detail" click -->
    <!-- ALL l2-section divs must be here -->
  </div>
</body>
```

**layer2 is NOT inside layer1.** They are siblings. layer1 closing `</div>` must come before `<div class="layer2">`.

---

## CSS Patterns

### Design system tokens (copy to every new project HTML)

```css
:root {
  --ink: #0f1820; --ink2: #1e2d3d;
  --paper: #f6f2eb; --paper2: #ede8df;
  --accent: [project-specific]; --accent2: [project-specific];
  --gold: #8a6a2e; --gold2: #b08940; --mist: #6b8fa5;
  --text: #1a2838; --text2: #4a6070; --text3: #7a92a5;
  --border: rgba(15,26,34,.1); --border2: rgba(15,26,34,.06);
  --green: #1b5c38; --red: #8b2218;
}
```

### Accent colors by project type

| Project type | --accent | --accent2 |
|---|---|---|
| Infrastructure / MBSE / SE | `#1a3a5c` | `#2a5480` |
| Optimisation / OR | `#8a4a1a` | `#b06a2a` |
| AI / Multi-agent / Data | `#1a3a5c` | `#2a5480` |
| Digital twin / Simulation | `#1a4a38` | `#2a6b52` |
| V&V / Verification | `#8b2218` | `#a63420` |
| Architecture / Trade space | `#2a1a5c` | `#4a3080` |

### Layer visibility

```css
.layer1 { display: none; background: var(--paper); border-bottom: 0.5px solid var(--border); }
.layer1.open { display: block; }
.layer2 { display: none; background: var(--paper); }
.layer2.open { display: block; }
.layer1.open, .layer2.open { animation: slideDown .2s ease; }
```

### Visual system rules — never break these

- **No box-shadows anywhere.** Grid separation uses `gap: 1px` + `background: var(--border)` as the grid container background.
- **No border-radius > 4px** on cards or sections (system default is 2px).
- **Tight grids**: `display: grid; gap: 1px; background: var(--border)` with white/paper children is the card separator pattern.

---

## Mermaid / SVG Diagram Patterns

### edgeLabel background bug

Mermaid-generated SVGs embed a `<style>` block inside the SVG. The default Mermaid theme often sets `.edgeLabel` background to a dark color (typically the accent `#1a3a5c`), making arrow label text unreadable.

**Fix:** Override in the SVG's embedded `<style>`:
```css
#my-svg .edgeLabel { background-color: transparent; text-align: center; }
#my-svg .edgeLabel p { background-color: transparent; }
#my-svg .edgeLabel rect { opacity: 0; background-color: transparent; fill: transparent; }
```

**Or in the outer page CSS (applies to all SVGs):**
```css
.edgeLabel { background-color: transparent !important; }
.edgeLabel p { background-color: transparent !important; }
.edgeLabel rect { opacity: 0 !important; fill: transparent !important; }
```

### Avoiding large grep hits in llm_simulation_project.html

Line ~212 of that file contains `window.LLM_EXPERIMENTS_DATA = {...}` — a massive inline JSON blob (~300KB). Any `grep` across this file returns this entire line in preview output and exhausts output limits. Workaround:

```bash
# Skip line 212 when grepping llm_simulation_project.html:
grep -n "your pattern" file.html | grep -v "^212:"

# Or use python to read specific line ranges:
sed -n '200,250p' file.html   # but output may still be large due to line length
```

---

## JavaScript Patterns

### Standard layer toggle (copy exactly)

```js
function toggleLayer1(e) {
  e.preventDefault();
  const l1 = document.getElementById('layer1');
  const caret = document.getElementById('ribbonCaret');
  const isOpen = l1.classList.contains('open');
  l1.classList.toggle('open');
  caret.style.transform = isOpen ? '' : 'rotate(180deg)';
  if (!isOpen) { l1.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function toggleLayer2() {
  const l2 = document.getElementById('layer2');
  const isOpen = l2.classList.contains('open');
  l2.classList.toggle('open');
  if (!isOpen) { l2.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}
```

### Scroll-spy pattern (IntersectionObserver for l2-nav active state)

```js
const secs = ['intro', 'model', 'schedulers', 'parameters', 'metrics', 'experiments', 'outputs', 'tradeoffs', 'conclusions'];
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id.replace('l2-', '');
      document.querySelectorAll('.l2-nav-item').forEach(b =>
        b.classList.toggle('active', b.dataset.section === id)
      );
    }
  });
}, { threshold: 0.2 });
window.addEventListener('DOMContentLoaded', () => {
  secs.forEach(id => {
    const el = document.getElementById('l2-' + id);
    if (el) obs.observe(el);
  });
});
```

**Common mistake:** Section IDs in the array must exactly match the HTML `id="l2-{name}"` attributes. A mismatch silently breaks scroll-spy.

---

## `htmlProjects.ts` Generation

### When to regenerate

Run `node scripts/extract-html-projects.mjs` after changing any of these in a project HTML:
- `.ribbon-tag` text
- `.ribbon-title` text
- `.ribbon-sub` text
- `.l1-eyebrow` text
- `.l1-tagline` text
- `.rm-val` / `.rm-lbl` metric values

### What it extracts (and where from)

| Field | Source element |
|---|---|
| `tag` | `.ribbon-tag` |
| `title` | `.ribbon-title` |
| `sub` | `.ribbon-sub` |
| `eye` | `.l1-eyebrow` |
| `intro` | `.l1-tagline` (truncated to ~180 chars) |
| `metrics[0..2]` | First 3 `.rm-val` + `.rm-lbl` pairs |
| `featured` | `eye` starts with `"01"` |
| `sortIndex` | Leading number in `eye` string |

---

## Adding a New Project Page

1. Create `public/projects/Claude projects/newproject.html` using `portfolio_page_framework.md` as the generation template
2. Verify three-layer structure: ribbon → layer1 → layer2, all as `<body>` children
3. Verify all `l2-section` divs are inside `#layer2` (check in browser console)
4. Run `node scripts/extract-html-projects.mjs`
5. Verify `src/data/htmlProjects.ts` has the new entry with correct fields
6. Test at `localhost:5173/project/newproject` (without `.html`)
7. Update `CURRENT_STATE.md`

---

## File Size Awareness

These files are large (100KB–800KB) due to inline base64 images or data blobs. Don't try to `Read` them whole — use `offset`/`limit` or targeted `grep`:

| File | Approx size | Large content |
|---|---|---|
| `llm_simulation_project.html` | ~730KB | Inline JSON data blob (line 212) + base64 chart SVGs |
| `infra_scheduling_project.html` | ~300KB+ | Base64 chart images |
| `ivv_local_gemma_llm_project.html` | ~200KB+ | Inline figures |
| `ruga_project_v2 (3).html` | ~200KB+ | Trade-space data |

**Safe approach for any of these:** grep for specific strings first, then `Read` with `offset`/`limit` targeting only the lines you need.

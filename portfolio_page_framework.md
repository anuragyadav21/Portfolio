# PORTFOLIO PROJECT PAGE — GENERATION FRAMEWORK
# Author: Anurag Yadav · Cornell Masters of Engineering, Systems Engineering
# Use this prompt to generate a matching three-layer HTML project documentation page.
# Works with Claude, GPT-4o, or any capable LLM.

---

## SYSTEM CONTEXT (paste as system prompt or at the top)

You are building a technical portfolio project page for Anurag Yadav, 
a systems engineer with 8 years of EPC/construction field experience and 
a Masters of Engineering in Systems Engineering from Cornell (May 2026). His portfolio 
uses a consistent three-layer architecture across all project pages. 
Your job is to generate a complete, self-contained HTML file that matches 
the established visual system and interaction pattern exactly.

---

## DESIGN SYSTEM (give this to the LLM verbatim)

### Color tokens
```css
--ink:       #0f1a22   /* near-black — primary dark background */
--ink2:      #182635   /* slightly lighter dark */
--paper:     #f6f2eb   /* warm off-white — main background */
--paper2:    #ece8df   /* slightly darker warm white — alternating sections */
--accent:    [CHOOSE ONE PER PROJECT — see accent palette below]
--gold:      #8a6a2e   /* timestamps, labels, secondary highlights */
--gold2:     #b08940   /* ribbon metric values */
--mist:      #6b8fa5   /* ribbon subtitle text */
--text:      #1a2838   /* primary body text */
--text2:     #4a6070   /* secondary body text */
--text3:     #7a92a5   /* labels, captions, metadata */
--border:    rgba(15,26,34,.1)   /* all borders */
--border2:   rgba(15,26,34,.06) /* subtle inner borders */
--green:     #1b5c38   /* positive metric values */
--red:       #8b2218   /* warning / negative */
```

### Accent palette (one per project, used for ribbon border, nav active state, labels)
```
Infrastructure / MBSE / SE:    --cobalt  #1a3a5c  --cobalt2  #2a5480
Optimisation / OR:             --amber   #8a4a1a  --amber2   #b06a2a  
AI / Multi-agent / Data:       --cobalt  #1a3a5c  --cobalt2  #2a5480
Digital twin / Simulation:     --sage    #1a4a38  --sage2    #2a6b52
V&V / Verification:            --rust    #8b2218  --rust2    #a63420
Architecture / Trade space:    --violet  #2a1a5c  --violet2  #4a3080
Field work / EPC:              --slate   #2a3a4a  --slate2   #3a5060
```

### Typography
```
Headlines:  'Playfair Display', serif  — font-size 32–44px, font-weight 400 or 700
Subheads:   'Playfair Display', serif italic — for project sub-taglines
Body:       'Libre Franklin', sans-serif — font-size 14–15px, line-height 1.75–1.85
Labels:     'Source Code Pro', monospace — font-size 9–11px, letter-spacing .1–.18em, uppercase
Code:       'Source Code Pro', monospace — dark background blocks
```

### Spacing rhythm
```
Section padding:  64–72px vertical, 56px horizontal
Card padding:     24–32px
Border radius:    2px (almost none — sharp, professional)
Gap between grid items: 1–2px (tight grid lines, not card shadows)
```

---

## THREE-LAYER ARCHITECTURE (mandatory — all pages must follow this)

### Layer 0 — Ribbon (always visible, sits on portfolio main page)
- Dark background (--ink) with 2px bottom border in accent color
- Left: accent-colored tag badge + project title (Playfair serif) + team/course subtitle (mono)
- Right: 2–3 key metrics (gold values, mono labels) + down caret
- Click toggles Layer 1 open/closed with caret rotation animation
- Ribbon is an <a> tag with onclick handler — no page navigation

### Layer 1 — Q&A Overview (expands below ribbon on click)
Structure:
1. Hero grid (2 columns):
   - Left: eyebrow label + large Playfair title (with italic em span) + 1 paragraph tagline + badge chips
   - Right: dark paper background + key metrics as stat-rows (label left, value right, hairline borders between)
2. Optional: App screenshot / mock / diagram reconstruction (full width, dark background)
3. Q&A grid (2 columns, 6–8 questions):
   - Question: mono uppercase label in accent color
   - Answer: 14px body text, 1.75 line-height, key terms bolded
4. Footer bar: italic note left + "Full technical detail ↓" button right
   - Button click toggles Layer 2

### Layer 2 — Full Technical Deep-Dive (expands below Layer 1)
Structure:
1. Sticky nav bar: mono uppercase section labels, active state = accent bottom border
2. 6–8 sections, each with:
   - Section header: section number (mono, accent color) + section title (Playfair serif 30px)
   - Prose intro (max-width 720px)
   - Technical content (tables, code blocks, diagrams, insight cards, metric strips)
   - Callout boxes (accent left border, light background) for key findings
3. Conclusion bar: dark background, Playfair title + mono detail line + optional live link
4. IntersectionObserver scroll-spy updates nav active state

---

## REUSABLE COMPONENT PATTERNS

### Metric strip (4 columns, used to highlight key numbers)
```html
<div class="metric-strip"> <!-- grid 4 cols, 1px gap, border background -->
  <div class="ms-item">    <!-- paper background, 20px padding -->
    <span class="ms-lbl">LABEL</span>       <!-- mono 9px uppercase -->
    <span class="ms-val [green|cobalt]">VALUE</span>  <!-- Playfair 24–28px -->
    <span class="ms-note">context note</span>  <!-- 11px text3 -->
  </div>
</div>
```

### Insight / contribution grid (2 columns)
```html
<div class="insight-grid"> <!-- 2 cols, 2px gap, border background -->
  <div class="insight">    <!-- paper background, 24–28px padding -->
    <div class="insight-head">Title</div>    <!-- 13px bold ink -->
    <div class="insight-body">Content</div>  <!-- 13px text2, 1.7 line-height -->
  </div>
</div>
```

### Callout box (accent left border)
```html
<div class="callout">  <!-- accent-left 3px, light accent background tint, 16px padding -->
  <strong>Key finding label:</strong> 
  Body text explaining the finding in 2–4 sentences.
</div>
```

### Code block (dark background)
```html
<div class="code-block">  <!-- ink background, 24px padding, overflow-x auto -->
  <span class="cb-label">SECTION LABEL</span>  <!-- mono 9px, accent color -->
  <pre>
    <span class="tok-key">keyword</span>   <!-- #7eb8f7 -->
    <span class="tok-str">string</span>    <!-- #a8d4a8 -->
    <span class="tok-com">comment</span>  <!-- rgba(255,255,255,.35) -->
  </pre>
</div>
```

### Architecture / data table
```html
<table class="arch-table">
  <thead><tr><th>Column</th>...</tr></thead>
  <tbody>
    <tr>
      <td>first col = mono accent color, acts as ID</td>
      <td>description text2</td>
    </tr>
  </tbody>
</table>
```

### App mock / screenshot placeholder (dark background, browser chrome)
```html
<div class="app-screen">
  <div class="app-bar">  <!-- browser chrome: dots + URL -->
    <div class="app-dot" style="background:#e74c3c"></div>
    <div class="app-dot" style="background:#f39c12"></div>
    <div class="app-dot" style="background:#27ae60"></div>
    <div class="app-url">app-url-here</div>
  </div>
  <div class="app-content">  <!-- 32px 40px padding -->
    <!-- reconstruct key UI elements as divs -->
  </div>
</div>
<div style="font-family:mono;font-size:10px;color:text3;padding:8px 16px;background:paper2">
  Caption or screenshot instruction
</div>
```

### SVG data flow diagram (inline, dark background container)
```html
<div class="flow-wrap">  <!-- ink background, 40px padding -->
  <div class="flow-title">DIAGRAM TITLE</div>
  <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <!-- Use: rect (fill rgba, stroke rgba), text (fill rgba), line with marker-end arrows -->
    <!-- Color scheme: rgba(26,58,92,.3) for boxes, rgba(107,143,165,.6) for arrows -->
    <!-- Accent boxes: rgba(42,107,52,.2) with rgba(42,107,52,.5) stroke -->
    <!-- Labels: font-family Source Code Pro, font-size 9-11, fill rgba(255,255,255,.7) -->
  </svg>
</div>
```

---

## JAVASCRIPT PATTERN (copy exactly)

```javascript
// Layer toggles
function toggleL1(e){
  e.preventDefault();
  const l1=document.getElementById('layer1');
  const c=document.getElementById('ribCaret');
  const isOpen=l1.classList.contains('open');
  l1.classList.toggle('open');
  c.style.transform=isOpen?'':'rotate(180deg)';
  if(!isOpen) setTimeout(()=>l1.scrollIntoView({behavior:'smooth',block:'start'}),50);
}
function toggleL2(){
  const l2=document.getElementById('layer2');
  l2.classList.toggle('open');
  if(l2.classList.contains('open')) setTimeout(()=>l2.scrollIntoView({behavior:'smooth',block:'start'}),50);
}
function scrollL2(id){
  const el=document.getElementById('l2-'+id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  document.querySelectorAll('.l2-btn').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
}

// Scroll spy (always include)
const secs=['section1','section2','section3',...];  // your section IDs
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const id=e.target.id.replace('l2-','');
      document.querySelectorAll('.l2-btn').forEach((b,i)=>b.classList.toggle('active',secs[i]===id));
    }
  });
},{threshold:0.2});
window.addEventListener('DOMContentLoaded',()=>{
  secs.forEach(id=>{const el=document.getElementById('l2-'+id);if(el) obs.observe(el);});
});
```

---

## CONTENT INPUT TEMPLATE (fill this in before generating)

```
PROJECT NAME: [e.g., "Robust Infrastructure Scheduling"]
COURSE/CONTEXT: [e.g., "SYSEN 5211 · Cornell · Solo project · Spring 2026"]
LAYER TAG: [e.g., "04 · Optimisation under uncertainty · MIP · Monte Carlo"]
ACCENT COLOR: [choose from palette above, e.g., "amber"]

RIBBON METRICS (3 key numbers):
  1. Value: [e.g., "−27.3%"]  Label: [e.g., "Traffic disruption"]
  2. Value: [e.g., "10,000"]  Label: [e.g., "Monte Carlo runs"]
  3. Value: [e.g., "121"]     Label: [e.g., "Decision variables"]

HERO TITLE (2–3 lines, last line italic):
  Line 1: [e.g., "Construction & traffic."]
  Line 2: [e.g., "Two systems,"]
  Line 3 (italic): [e.g., "one model."]

HERO TAGLINE (1 paragraph, 2–4 sentences):
  [Describe the core problem and what was built]

BADGES (5–7 short chips):
  [e.g., "SYSEN 5211 · Cornell", "Solo project", "Python · PuLP", ...]

HERO STATS (6–7 key metrics for right panel):
  [Label: Value pairs, e.g., "Mean cost reduction: −$35K (−2.8%)"]

LAYER 1 Q&A (6–8 questions with full answers):
  Q1: [question]
      [answer — 3–6 sentences, bold key terms]
  Q2: ...

FOOTER NOTE:
  [e.g., "Solo project · SYSEN 5211 Spring 2026 · GitHub: ..."]

LIVE LINK (if any):
  [URL]

LAYER 2 SECTIONS (6–8, with section ID and title):
  1. id: "problem"      title: "Problem & Systems Framing"
  2. id: "formulation"  title: "Mathematical Formulation"
  ...

FOR EACH LAYER 2 SECTION, PROVIDE:
  - Intro prose (2–4 sentences)
  - Main content type: [table | code | diagram | insight-grid | metric-strip | callout]
  - Content data (raw — the LLM will format it)
  - At least one callout box with a key finding

FIGURES (if any — base64 encoded PNGs):
  [Provide as: key_name: "data:image/jpeg;base64,..." with caption]
  [Or: "no figures — LLM should reconstruct as SVG/HTML mock"]

CONCLUSION BAR TEXT:
  [Course · Institution · Year · key results one-liner · optional live link]
```

---

## GENERATION PROMPT (paste after filling the template above)

```
Using the design system, component patterns, three-layer architecture, 
and JavaScript pattern defined above, generate a complete self-contained 
HTML file for the following project.

REQUIREMENTS:
1. Single file — all CSS inline in <style>, all JS in <script> at bottom
2. No external dependencies except Google Fonts (preconnect + the font link provided)
3. Ribbon is always visible. Layer 1 hidden by default (display:none), opens on ribbon click.
   Layer 2 hidden by default, opens on "Full technical detail" button click.
4. Sticky nav in Layer 2 with scroll-spy using IntersectionObserver
5. All colors from the design system — no hex values outside those defined
6. Sharp borders (border-radius: 2px), no box shadows, no rounded cards
7. Tight grid gaps (1–2px) with border color as grid background
8. The accent color you choose must be used consistently: ribbon border, 
   nav active state, Q&A question labels, section numbers, callout borders
9. Figures: if base64 images provided, use fig-block pattern. 
   If no figures provided, use SVG inline diagrams or HTML mocks.
10. The page must be self-contained — opening the HTML file in a browser 
    with no internet (except Google Fonts) must render correctly.

PROJECT DATA:
[PASTE YOUR FILLED TEMPLATE HERE]
```

---

## QUALITY CHECKS (ask the LLM to verify before finalizing)

After generating, verify:
- [ ] Ribbon opens Layer 1 on click, caret rotates
- [ ] "Full technical detail" button opens Layer 2
- [ ] Sticky nav updates active state on scroll (IntersectionObserver)
- [ ] No `makePlot`, `tsGrid`, or other stale JS references that go nowhere
- [ ] No `localhost:` references in any src or href
- [ ] All `<script>` content starts cleanly (no orphaned `});` at top)
- [ ] All section IDs referenced in scroll-spy array match actual element IDs
  (sections use `id="l2-{name}"`, array uses `'{name}'`)
- [ ] Google Fonts preconnect + href present in <head>
- [ ] At least one callout box per Layer 2 section
- [ ] Conclusion bar present at bottom of Layer 2

---

## EXISTING PAGES IN THE SERIES (for consistency reference)

The following pages already exist and establish the pattern:

| Page | Accent | Layer 2 Sections |
|------|--------|-----------------|
| RUGA Aircraft Architecture | violet (#534AB7) | intro, decisions, enumeration, tradespace, analysis, selected, functional, conclusions |
| Robust Infrastructure Scheduling | amber (#854F0B) | problem, formulation, uncertainty, results, tradeoffs, decisions, discussion, conclusions |
| Sustainable Bus Shelter (MBSE) | teal (#1a5c52) | background, stakeholders, requirements, architecture, behaviour, risk, parametric, reflection |
| News for People in a Hurry | cobalt (#1a3a5c) | architecture, dataflow, agents, tools, ui, code, deployment, reflection |

New pages should feel visually consistent with these four but use a 
distinct accent color if the project category is different.

---

## MINIMAL EXAMPLE (reference implementation skeleton)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[PROJECT NAME] — Anurag Yadav</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;500&family=Libre+Franklin:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  /* paste full design system tokens here */
  /* add accent: --accent: [color]; --accent2: [color]; */
}
/* paste all component CSS here */
</style>
</head>
<body>

<!-- RIBBON -->
<a class="ribbon" onclick="toggleL1(event)" href="#" id="ribbonEl">
  <!-- left: tag + title + sub -->
  <!-- right: 3 metrics + caret -->
</a>

<!-- LAYER 1 -->
<div class="layer1" id="layer1">
  <!-- hero grid -->
  <!-- optional app mock or figure -->
  <!-- qa-grid -->
  <!-- l1-foot -->
</div>

<!-- LAYER 2 -->
<div class="layer2" id="layer2">
  <nav class="l2-nav"><!-- nav buttons --></nav>
  <!-- sections: each <div class="l2-sec scroll-anchor" id="l2-{sectionid}"> -->
  <!-- conclusion bar -->
</div>

<script>
/* paste JS pattern here */
</script>
</body>
</html>
```

---

## NOTES FOR THE LLM

- Never add box-shadows. The grid-as-background pattern (1px gap, border color as bg) 
  is the visual separator. Shadows break the aesthetic.
- Never add border-radius > 4px on cards. 2px is the system default.
- Never use flexbox gap > 16px for inline elements or > 24px for block layouts 
  unless it's section-level spacing.
- The "tight" feel comes from the 1-2px grid gaps with colored backgrounds, 
  not from padding. Don't over-pad.
- Playfair Display italic is used for the project sub-tagline in the hero title 
  (the <em> span). Not for body text.
- Source Code Pro is for metadata only: labels, badges, section numbers, 
  code, timestamps. Never for body copy or headings.
- When writing Q&A answers: 3–6 sentences, bold 2–3 key technical terms per answer, 
  no bullet points inside answers (flowing prose only).
- Callout boxes should contain a specific finding, not generic advice. 
  Lead with <strong>Finding label:</strong> then the substance.
- The conclusion bar always has two elements: a Playfair title line 
  (course/institution/year) and a mono detail line (key results + optional live link).

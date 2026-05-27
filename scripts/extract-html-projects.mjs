/**
 * Reads all project HTML files from public/projects/Claude projects/
 * and extracts card metadata into src/data/htmlProjects.ts
 *
 * Run: node scripts/extract-html-projects.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HTML_DIR = path.join(ROOT, "public", "projects", "Claude projects");
const OUT_FILE = path.join(ROOT, "src", "data", "htmlProjects.ts");

/** Homepage card labels (pc-layer) — override HTML ribbon extraction */
const TAG_OVERRIDES = {
  "infra_scheduling_project_interactive.html": "Flagship · Stochastic Optimization · Capital Programs",
  "turbine_digital_twin_project.html": "Digital Twin · Physical Asset · Physics-Based Model",
  "mbse_bus_shelter (1).html": "MBSE · SysML · Physical Infrastructure",
  "ivv_local_gemma_llm_project.html": "V&V · Stochastic AI Systems · Bounded-Behavior Verification",
  "ruga_project_v2 (3).html": "Systems Architecture · Trade Space · DOE / MAUT",
  "llm_simulation_project.html": "Discrete-Event Simulation · ORIE",
  "rag_lab_multimodal_project.html": "Data Science · Multimodal RAG",
  "news_app_project (1).html": "Data Science · Multi-agent AI",
};

/**
 * Explicit homepage card order. Files not listed fall to the end.
 * The first entry is the flagship; the next three are the differentiator set
 * a recruiter actually clicks (capital programs + digital eng buyers).
 */
const ORDER = [
  "infra_scheduling_project_interactive.html",
  "turbine_digital_twin_project.html",
  "mbse_bus_shelter (1).html",
  "ivv_local_gemma_llm_project.html",
  "ruga_project_v2 (3).html",
  "llm_simulation_project.html",
  "rag_lab_multimodal_project.html",
  "news_app_project (1).html",
];

/** Files to skip entirely (templates in scripts/case-study/, etc.) */
const EXCLUDE = new Set();

/**
 * Per-file metadata overrides for projects whose HTML uses non-standard markup
 * (e.g. interactive variants without rib-* classes). Any field set here wins
 * over the auto-extracted value.
 */
const META_OVERRIDES = {
  "infra_scheduling_project_interactive.html": {
    title: "Robust Infrastructure Scheduling",
    sub: "Anurag Yadav · Cornell SYSEN 5211 · Stochastic optimization for capital programs",
    eye: "01 · Stochastic optimization · MIP · Monte Carlo",
    intro:
      "Urban corridor work runs inside live traffic. This project couples a 24-task construction schedule with four daily traffic blocks, optimises cost and disruption jointly, and stress-tests the plan with 10,000 Monte Carlo runs.",
    metrics: [
      { val: "−27.3%", lbl: "Traffic disruption" },
      { val: "−$35K", lbl: "Mean cost vs baseline" },
      { val: "10,000", lbl: "Monte Carlo runs" },
    ],
  },
  "turbine_digital_twin_project.html": {
    title: "Wind Turbine Digital Twin",
    sub: "Anurag Yadav · Cornell SYSEN 5490 · Browser HAWT twin with five-experiment V&V",
    eye: "02 · Digital twin · Physics-based model · V&V",
    intro:
      "A reduced-order horizontal-axis wind turbine digital twin runs in the browser. Five sequential experiments check it against analytical physics, exercise it under turbulence and transients, and document where the model must not be trusted, including a 7× surrogate-vs-twin annual energy gap that surfaced during design optimisation.",
    metrics: [
      { val: "0.48", lbl: "Peak Cp (81% Betz)" },
      { val: "19.4%", lbl: "Capacity factor" },
      { val: "7×", lbl: "Surrogate AEP gap" },
    ],
  },
  "ivv_local_gemma_llm_project.html": {
    title: "IV&V of a Locally Deployed LLM System",
    sub: "Anurag Yadav · Cornell SYSEN 5250 · Gemma 4B · May 2026",
    eye: "05 · Verification & validation · Statistical TC suite · Innoslate traceability",
    intro:
      "Independent verification and validation of a locally deployed Gemma 4B model (Ollama) on a fixed 50-question benchmark at five decoding temperatures with five runs per cell. Every response was scored against an established evaluation rulebook.",
    metrics: [
      { val: "PASS", lbl: "All 5 test cases" },
      { val: "1,250", lbl: "Scored observations" },
      { val: "93.6%", lbl: "Cells CV < 0.10" },
    ],
  },
  "llm_simulation_project.html": {
    title: "Modeling LLM Query Serving Systems",
    sub: "Anurag Yadav · Cornell SYSEN 5580 · Discrete-event GPU scheduling simulation",
    eye: "07 · ORIE · LLM serving · Queueing and scheduler trade studies",
    intro:
      "A discrete-event simulation comparing basic FIFO assignment and chunked prefill batching for multi-GPU LLM serving under stochastic arrivals, with TTFT/TBT, queue depth, throughput, and utilization tracked across replications.",
    metrics: [
      { val: "−253 ms", lbl: "P99 TTFT @ 10 GPUs" },
      { val: "10×", lbl: "Replications" },
      { val: "80k+", lbl: "Post-warmup queries" },
    ],
  },
  "ruga_project_v2 (3).html": {
    title: "Next-Gen Hybrid-Electric Aircraft — RUGA",
    sub: "Anurag Yadav · Cornell SYSEN 5400 · Tradespace architecture and feature mining · Spring 2026",
    eye: "06 · Systems architecture · Tradespace enumeration · Feature mining",
    intro:
      "A constrained tradespace study for a next-generation general aviation aircraft: enumerate feasible architectures across eight decisions (D1–D8), score cost/schedule/reliability/durability, mine dominant rules in the Pareto region, and select a robust configuration with an explicit evidence chain.",
    metrics: [
      { val: "184,212", lbl: "Architectures evaluated" },
      { val: "99.10%", lbl: "Propulsion reliability" },
      { val: "8", lbl: "Architectural decisions" },
    ],
  },
  "mbse_bus_shelter (1).html": {
    title: "Sustainable Smart Bus Shelter — CUSD / TCAT",
    sub: "Anurag Vijay Yadav · Cornell Systems Engineering · MBSE across 32 SE tools",
    eye: "02 · Systems Modelling · MBSE · Requirements · V&V",
    intro:
      "TCAT bus stops in Ithaca are exposed infrastructure with no emergency capability, no real-time information, and grid-dependent power. This project applied 32 systems engineering tools—from stakeholder mapping through SysML, subsystem allocation, risk analysis, and verification planning—for a solar-powered smart shelter.",
    metrics: [
      { val: "32", lbl: "SE tools applied" },
      { val: "36", lbl: "Requirements (OR+DR)" },
      { val: "2.2kW", lbl: "Solar · 72hr autonomy" },
    ],
  },
  "news_app_project (1).html": {
    title: "News for People in a Hurry",
    sub: "Anurag Yadav · Cornell SYSEN 5381 · Multi-agent NYT pipeline with market validation",
    eye: "07 · AI & data systems · Multi-agent · RAG · Tool calling",
    intro:
      "A validation-first news app: ingest live NYT feeds, enrich articles with AI summaries, then run a 3-agent workflow that cross-links stories, scores world mood, and cross-references the narrative against live Yahoo Finance data before display.",
    metrics: [
      { val: "3", lbl: "Agent pipeline" },
      { val: "Live", lbl: "Deployed · Posit Cloud" },
      { val: "6", lbl: "News sections + Signal Studio" },
    ],
  },
  "rag_lab_multimodal_project.html": {
    title: "RAG Lab — Lecture Assistant",
    sub: "Anurag Yadav · Cornell SYSEN 5400 · Multimodal retrieval over course materials",
    eye: "06 · Retrieval-augmented generation · Vision + text",
    intro: "A local multimodal RAG stack ingests PDF and PPTX lecture decks into Chroma with per-slide or per-page chunks, optional slide preview images, and metadata for equations and diagrams. Students query via CLI or a Streamlit dashboard; answers are grounded in retrieved passages and slide images.",
    metrics: [
      { val: "3,018", lbl: "Indexed chunks" },
      { val: "k ≤ 12", lbl: "Retrieval depth" },
      { val: "OpenAI", lbl: "Primary LLM" }
    ]
  },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function first(html, ...patterns) {
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return decode(m[1].trim());
  }
  return "";
}

function decode(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, "") // strip inline tags
    .trim();
}

function extractMetrics(html) {
  const vals = [...html.matchAll(/class="rm-val"[^>]*>(.*?)</gs)].map((m) => decode(m[1]));
  const lbls = [...html.matchAll(/class="rm-lbl"[^>]*>(.*?)</gs)].map((m) => decode(m[1]));
  return vals.map((v, i) => ({ val: v, lbl: lbls[i] ?? "" })).slice(0, 3);
}

function extractMetricsFromHtml(html) {
  const ribbon = extractMetrics(html);
  if (ribbon.length >= 3) return ribbon;
  const vals = [...html.matchAll(/class="metric-val"[^>]*>(.*?)</gs)].map((m) =>
    decode(m[1]),
  );
  const lbls = [...html.matchAll(/class="metric-lbl"[^>]*>(.*?)</gs)].map((m) =>
    decode(m[1]),
  );
  const cards = vals.map((v, i) => ({ val: v, lbl: lbls[i] ?? "" })).slice(0, 3);
  return cards.length >= 3 ? cards : ribbon;
}

function sortIndex(eye) {
  const m = eye.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 99;
}

// ── main ─────────────────────────────────────────────────────────────────────

const files = fs
  .readdirSync(HTML_DIR)
  .filter((f) => f.endsWith(".html") && !EXCLUDE.has(f))
  .sort();

const projects = [];

for (const fname of files) {
  const html = fs.readFileSync(path.join(HTML_DIR, fname), "utf8");

  const tag =
    TAG_OVERRIDES[fname] ??
    first(html, /class="rib-tag"[^>]*>(.*?)</s, /class="ribbon-tag"[^>]*>(.*?)</s);
  const title = first(
    html,
    /class="topbar-title"[^>]*>(.*?)</s,
    /class="rib-title"[^>]*>(.*?)</s,
    /class="ribbon-title"[^>]*>(.*?)</s,
  );
  const sub = first(
    html,
    /class="topbar-meta"[^>]*>(.*?)</s,
    /class="rib-sub"[^>]*>(.*?)</s,
    /class="ribbon-sub"[^>]*>(.*?)</s,
  );
  const eye = first(
    html,
    /class="hero-kicker"[^>]*>(.*?)</s,
    /class="l1-eye"[^>]*>(.*?)</s,
    /class="l1-eyebrow"[^>]*>(.*?)</s,
  );
  const intro = first(
    html,
    /class="hero-lede"[^>]*>(.*?)<\/p>/s,
    /class="l1-tag"[^>]*>(.*?)<\/p>/s,
    /class="l1-tagline"[^>]*>(.*?)<\/p>/s,
  );

  const metrics = extractMetricsFromHtml(html);
  const featured = tag.toLowerCase().includes("flagship");

  const orderIndex = ORDER.indexOf(fname);
  const meta = META_OVERRIDES[fname] ?? {};
  const finalEye = meta.eye ?? eye;

  projects.push({
    id: fname.replace(/\s+/g, "-").replace(/\.html$/, "").toLowerCase(),
    htmlFile: fname,
    tag,
    title: meta.title ?? title,
    sub: meta.sub ?? sub,
    eye: finalEye,
    intro: (meta.intro ?? intro).slice(0, 240),
    metrics: meta.metrics ?? metrics,
    featured,
    sortIndex: orderIndex === -1 ? 999 + sortIndex(finalEye) : orderIndex,
  });
}

// sort by explicit ORDER (sortIndex). Featured already pinned at top of ORDER.
projects.sort((a, b) => a.sortIndex - b.sortIndex);

// ── emit TypeScript ──────────────────────────────────────────────────────────

const ts = `// Generated by scripts/extract-html-projects.mjs — TAG_OVERRIDES apply on homepage cards

export type HtmlProjectMetric = { val: string; lbl: string };

export type HtmlProject = {
  id: string;
  htmlFile: string;
  tag: string;
  title: string;
  sub: string;
  eye: string;
  intro: string;
  metrics: HtmlProjectMetric[];
  featured: boolean;
  sortIndex: number;
};

export const htmlProjects: HtmlProject[] = ${JSON.stringify(projects, null, 2)};
`;

fs.writeFileSync(OUT_FILE, ts);
console.log(`✓ Wrote ${projects.length} projects → ${path.relative(ROOT, OUT_FILE)}`);
projects.forEach((p) => console.log(`  ${p.featured ? "★" : " "} [${p.sortIndex}] ${p.title}`));

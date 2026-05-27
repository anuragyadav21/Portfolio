import type { FieldStory, TimelineItem } from "../types";

/** Display order: Avalon → Nyati → Manthan (career progression on cards). */
export const fieldStories: FieldStory[] = [
  {
    id: "avalon",
    company: "Avalon Developers / Pune",
    years: "2022–2024",
    role: "Project Manager",
    title: "250-Acre Township — Systems Integration Lead",
    summary:
      "Primary interface between structural, MEP, survey, and ownership on a 250-acre township program. Ran feasibility work, coordinated six concurrent projects, and improved on-time delivery from 76% to 94%. Also managed a 40,000 sq ft restaurant with a 30 m clear-span roof through continuous design changes.",
    tag: "250-acre township / 76% → 94% delivery / 6 concurrent projects",
    modal: {
      kicker: "Avalon Developers / Pune / 2022–2024",
      title: "Project Manager — Township & High-Complexity Builds",
      sections: [
        {
          title: "Work profile",
          body: [
            "Coordinated structural, MEP, survey, and ownership on a 250-acre township program plus concurrent commercial work. The job was keeping interfaces visible before they turned into site disputes, not only tracking tasks.",
            "Portfolio included six active projects at peak; the restaurant build (40,000 sq ft, ~30 m clear span) was the highest-change environment: design revisions, RFIs, and field verification overlapped weekly.",
          ],
          metrics: [
            { value: "250 ac", label: "Township program" },
            { value: "6", label: "Concurrent projects" },
            { value: "76→94%", label: "On-time delivery" },
          ],
        },
        {
          title: "Day to day (typical week)",
          body: [
            "Morning: site walk or coordination call on what is blocked, which drawing revision is on the floor, and which trade is waiting on a decision.",
            "Midday: interface meetings (structure, MEP, finishes), feasibility checks on proposed changes, and updating the short list of decisions ownership needs before end of week.",
            "Afternoon: field verification on grid, levels, and critical dimensions, then closing loops with consultants so the next pour or install is not built on stale information.",
            "Ongoing: translate technical disagreement into a decision record: options, constraint, recommendation, who signs off.",
          ],
        },
        {
          title: "Signature field story — inclined columns",
          body: [
            "Structural columns required non-standard angles to the base grid. Standard setting-out did not handle the geometry cleanly, and tolerance was tight.",
            "Developed a field positioning method with angular reference fixtures and sequential verification checks to hold required inclination within tolerance. Devised on site, checked against first principles, executed without a dummy run.",
          ],
        },
        {
          title: "What this taught me",
          body: [
            "Define the reference frame, make the interface visible, and build checks into the process before errors propagate. I used the same pattern later in MBSE, digital twins, and V&V work.",
          ],
        },
      ],
    },
  },
  {
    id: "nyati",
    company: "Nyati Group / Pune",
    years: "2019–2022",
    role: "Civil Engineer",
    title: "Structural & Infrastructure Systems Integration",
    summary:
      "Led integration across structural, MEP, and civil scopes on a $15M commercial portfolio: four high-rise and infrastructure projects including PQC roads, retaining walls, and STPs. Reduced post-occupancy defects by 31% and schedule variability by 28%.",
    tag: "Systems integration / $15M portfolio / 31% defect reduction",
    modal: {
      kicker: "Nyati Group / Pune / 2019–2022",
      title: "Civil Engineer — Portfolio Integration & Structural Response",
      sections: [
        {
          title: "Work profile",
          body: [
            "Senior engineer on a ~$15M commercial portfolio: four high-rise and infrastructure scopes (PQC roads, retaining walls, STPs) where structural, MEP, and civil had to be integrated before occupancy, not patched after handover.",
            "Accountable for catching interface failures early: clash resolution, constructability review, and aligning consultant output with what site teams could execute.",
          ],
          metrics: [
            { value: "$15M", label: "Portfolio scale" },
            { value: "−31%", label: "Post-occupancy defects" },
            { value: "−28%", label: "Schedule variability" },
          ],
        },
        {
          title: "Day to day (typical week)",
          body: [
            "Review updated drawings and site photos against as-built conditions: what changed since last week and what is at risk for the next pour or service install.",
            "Chair or join coordination sessions with contractors and supervisors: translate structural intent into sequence, access, and temporary works.",
            "Respond to field exceptions (cracks, alignment, reinforcement conflicts) with a documented path: assess → option → recommendation → sign-off.",
            "Track open interface items (MEP penetrations, drainage, retaining wall tie-ins) so they do not become end-of-project punch-list surprises.",
          ],
        },
        {
          title: "Signature field story — shear wall jacketing",
          body: [
            "A shear wall in an active project showed a condition that required immediate response without full teardown. Assessed against design intent and selected steel plate jacketing as the intervention.",
            "Coordinated fabrication, surface prep, installation, and post-intervention checks under active site constraints, with documentation structural reviewers, contractors, and supervisors could follow on a compressed timeline.",
          ],
        },
        {
          title: "What this taught me",
          body: [
            "Models only help when they respect the constraints that decide whether work can actually happen. That constraint carried into optimization, MBSE, and verification work at Cornell.",
          ],
        },
      ],
    },
  },
  {
    id: "manthan",
    company: "Manthan Construction / Pune",
    years: "2016–2019",
    role: "Structural Engineer",
    title: "Structural Systems — 5 Projects, $8M Portfolio",
    summary:
      "Coordinated PEB and RCC structural systems across 5 industrial and commercial projects totaling $8M and 180,000 sq ft. Resolved 45+ design conflicts before construction began. Reduced material waste by 14% and achieved 89% on-schedule delivery through proactive interface planning.",
    tag: "$8M portfolio / 45+ conflicts resolved / 14% waste reduction",
    modal: {
      kicker: "Manthan Construction / Pune / 2016–2019",
      title: "Structural Engineer — Industrial & Commercial Systems",
      sections: [
        {
          title: "Work profile",
          body: [
            "Structural engineer across five industrial and commercial projects (~$8M, ~180,000 sq ft), mixing PEB and RCC systems. Most learning was resolving design–field gaps before steel and concrete were committed.",
            "Focused on proactive interface planning: getting structural, architectural, and services alignment done while changes were still cheap.",
          ],
          metrics: [
            { value: "5", label: "Projects" },
            { value: "45+", label: "Conflicts resolved pre-build" },
            { value: "−14%", label: "Material waste" },
          ],
        },
        {
          title: "Day to day (typical week)",
          body: [
            "Mark up consultant drawings against site constraints: crane reach, staging, foundation access, and connection details that look fine on paper but fail in sequence.",
            "Quantity and feasibility sense-checks with procurement and site leads before orders go out.",
            "Support setting-out and steel/concrete inspections; document deviations with photos and sketches for consultant close-out.",
            "Participate in pre-pour and pre-erection reviews so the next activity is not building on an unresolved RFI.",
          ],
        },
        {
          title: "Signature field story — township feasibility (Google Earth)",
          body: [
            "A developer needed township feasibility before committing to formal survey spend: is this land viable, and what are the primary constraints?",
            "Used Google Earth spatial data for slope, drainage, access, utility proximity, and density to structure a go/no-go for the next investment stage. The deliverable was a practical recommendation for the developer.",
          ],
        },
        {
          title: "What this taught me",
          body: [
            "Decompose the problem, gather available data, model constraints, recommend next action. I later did the same in digital-twin and decision-support work, before I had formal names for the steps.",
          ],
        },
      ],
    },
  },
];

export const timeline: TimelineItem[] = [
  { years: "2024-2026", company: "Cornell University", role: "Masters of Engineering, Systems Engineering" },
  { years: "2022-2024", company: "Avalon Developers", role: "Project Manager" },
  { years: "2019-2022", company: "Nyati Group", role: "Civil Engineer" },
  { years: "2016-2019", company: "Manthan Construction", role: "Structural Engineer" },
];

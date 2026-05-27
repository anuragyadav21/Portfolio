import { SectionHeader } from "./SectionHeader";

const principles = [
  "The recurring problem across my work is decision-making in systems where operations, uncertainty, and coordination pressure interact at the same time.",
  "Field work taught me to read what drawings and models tend to leave out: sequencing friction, maintenance access, site constraints, and the cost of a late call.",
  "Graduate study added methods to model those tradeoffs, specify verification for uncertain systems, and test decisions before they reach the field.",
  "I want to keep working on physical and operational systems that need structured analysis and a realistic view of how the work actually gets done.",
];

const lessons = [
  {
    title: "Models need constraints that survive contact with operations",
    body: "On the infrastructure scheduling project, the solver was rarely the bottleneck. The harder work was deciding which constraints matched field reality and which ones were just easy to quantify.",
  },
  {
    title: "Stochastic systems need verification on bounded behavior, not exact outputs",
    body: "The Gemma 4B V&V study ran 1,250 observations across five temperatures. All formal criteria passed, and we still found domain-specific hallucination risk and a structural math failure that mattered operationally.",
  },
  {
    title: "MBSE is more useful when you already know what breaks in the field",
    body: "On the bus shelter project, the value was catching maintenance access, energy autonomy, emergency response timing, and stakeholder conflicts early enough to change the design on paper instead of on site.",
  },
  {
    title: "Construction experience carried forward into systems engineering",
    body: "Graduate study did not replace earlier project work. It gave vocabulary and methods for patterns I had already seen on site: interfaces matter, timing matters, and credible assumptions matter at least as much as clever models.",
  },
];

export function WhyFitsSection() {
  return (
    <section id="working" className="sec">
      <SectionHeader number="02" title="Why This Background Fits" />
      <div className="principle-list" data-reveal-group>
        {principles.map((paragraph, i) => (
          <div
            className="principle-item"
            key={paragraph.slice(0, 40)}
            data-reveal="up"
          >
            <span className="principle-n">0{i + 1}</span>
            <p className="principle-text">{paragraph}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CornellChangedSection() {
  return (
    <section id="lessons" className="sec lessons-section">
      <SectionHeader number="05" title="What Cornell Changed" />
      <p className="sec-sub lessons-sub" data-reveal="up">
        Specific shifts from combining field experience with formal systems methods, organized by project type.
      </p>
      <div className="lesson-grid" data-reveal-group>
        {lessons.map((lesson) => (
          <article
            className="lesson-card"
            key={lesson.title}
            data-reveal="up"
          >
            <h3>{lesson.title}</h3>
            <p>{lesson.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { htmlProjects } from "../data/htmlProjects";
import type { HtmlProject } from "../data/htmlProjects";
import { projectCardDomId } from "../data/vmodelProjects";
import type { AudienceVariant } from "../types";
import { SectionHeader } from "./SectionHeader";

type ProjectsSectionProps = {
  audience?: AudienceVariant;
};

function metricTone(val: string): string {
  const v = val.trim();
  if (/pass/i.test(v)) return "tone-pass";
  if (/^[−\-]/.test(v) || v.startsWith("−")) return "tone-good";
  if (/\d/.test(v)) return "tone-highlight";
  return "tone-neutral";
}

function ProjectMetrics({ project }: { project: HtmlProject }) {
  return (
    <div className="pc-metrics">
      {project.metrics.map((m) => (
        <div className={`pc-metric ${metricTone(m.val)}`} key={m.lbl}>
          <span className="pc-metric-val">{m.val}</span>
          <span className="pc-metric-lbl">{m.lbl}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: HtmlProject; index: number }) {
  const isFlagship = project.featured;
  const className = ["pc", isFlagship ? "flagship" : ""].filter(Boolean).join(" ");
  const num = String(index + 1).padStart(2, "0");
  return (
    <a
      id={projectCardDomId(project.id)}
      href={`/project/${project.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-project-tag={project.tag}
      data-project-id={project.id}
      data-reveal="up"
    >
      <div className="pc-top">
        <div className="pc-layer">{project.tag}</div>
        <div className="pc-index">{num}</div>
      </div>
      <div className="pc-main">
        <div className="pc-copy">
          <h3 className="pc-title">{project.title}</h3>
          <p className="pc-snip">{project.intro}</p>
        </div>
        <div className="pc-side">
          <ProjectMetrics project={project} />
          <div className="pc-chips">
            {project.eye
              .split("·")
              .slice(1)
              .map((s) => s.trim())
              .filter(Boolean)
              .map((chip) => (
                <span className="pc-chip" key={chip}>
                  {chip}
                </span>
              ))}
          </div>
        </div>
      </div>
      <span className="pc-more">View project →</span>
    </a>
  );
}

export function ProjectsSection({ audience: _audience }: ProjectsSectionProps) {
  const [featured, ...rest] = htmlProjects;

  return (
    <section id="projects" className="sec">
      <SectionHeader number="03" title="Selected Projects" />
      <div className="projects-intro">
        <p className="sec-sub" data-reveal="up">
          Computational work on the kinds of operational problems I spent eight years dealing with physically:
          stochastic optimization for capital schedules, digital twins for physical assets, MBSE for infrastructure
          architecture, and V&amp;V for deterministic and stochastic systems.
        </p>
        <div className="projects-note" data-reveal="up">
          <span className="projects-note-label">Shortlist</span>
          <p>Flagship first. The next three cover the methods I lean on most: optimization, digital twin, MBSE, and V&amp;V.</p>
        </div>
      </div>

      {featured && (
        <div className="proj-featured">
          <ProjectCard key={`${featured.id}-${featured.tag}`} project={featured} index={0} />
        </div>
      )}

      <div className="proj-list" data-reveal-group>
        {rest.map((project, i) => (
          <ProjectCard key={`${project.id}-${project.tag}`} project={project} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

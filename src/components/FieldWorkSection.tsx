import { useState } from "react";
import { fieldStories, timeline } from "../data/fieldWork";
import type { FieldStory } from "../types";
import { Modal } from "./Modal";
import { SectionHeader } from "./SectionHeader";

export function FieldWorkSection() {
  const [activeStory, setActiveStory] = useState<FieldStory | null>(null);

  return (
    <section id="epc" className="sec dark-section">
      <SectionHeader number="01" title="Field Work" dark />
      <p className="epc-intro" data-reveal="up">
        Eight years on sites where wrong calls had physical consequences. That work shaped how I read constraints,
        interfaces, and execution risk well before I had systems-engineering vocabulary for any of it. Open a role
        for the full profile and a typical week.
      </p>
      <div className="epc-grid" data-reveal-group>
        {fieldStories.map((story, storyIndex) => (
          <button
            type="button"
            className="es"
            key={story.id}
            onClick={() => setActiveStory(story)}
            aria-haspopup="dialog"
            aria-label={`Open work profile: ${story.company}, ${story.role}`}
            data-reveal="up"
          >
            <span className="es-co">
              {story.company} · {story.years}
            </span>
            <span className="es-role">{story.role}</span>
            <h3 className="es-title">{story.title}</h3>
            <p className="es-body">{story.summary}</p>
            <span className="es-tag">{story.tag}</span>
            <span className="es-more">Work profile →</span>
          </button>
        ))}
      </div>
      <div className="tl" data-reveal-group>
        {timeline.map((item) => (
          <div className="tl-item" key={`${item.company}-${item.years}`} data-reveal="up">
            <div className="tl-yr">{item.years}</div>
            <div className="tl-co">{item.company}</div>
            <div className="tl-role">{item.role}</div>
          </div>
        ))}
      </div>
      <Modal content={activeStory?.modal ?? null} onClose={() => setActiveStory(null)} />
    </section>
  );
}

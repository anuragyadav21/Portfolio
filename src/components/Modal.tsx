import { useEffect, useRef } from "react";
import type { Project } from "../types";

type ModalContent = Project["modal"];

type ModalProps = {
  content: ModalContent | null;
  onClose: () => void;
};

export function Modal({ content, onClose }: ModalProps) {
  const modalRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!content) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [content, onClose]);

  if (!content) return null;

  return (
    <div className="modal-bg open" onClick={onClose} role="presentation">
      <article
        className="modal"
        onClick={(event) => event.stopPropagation()}
        aria-labelledby="modal-title"
        aria-modal="true"
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close project detail" ref={closeButtonRef}>
          x
        </button>
        <header className="modal-header">
          <div className="modal-kicker">{content.kicker}</div>
          <h3 className="modal-title" id="modal-title">
            {content.title}
          </h3>
          {content.artifacts && (
            <div className="modal-artifacts" aria-label="Project artifacts">
              {content.artifacts.map((artifact) => (
                <a href={artifact.href} key={artifact.href} rel="noreferrer" target="_blank">
                  {artifact.label}
                </a>
              ))}
            </div>
          )}
        </header>
        <div className="modal-body">
          {content.sections.map((section) => (
            <section className="modal-section" key={section.title}>
              <div className="ms-title">{section.title}</div>
              {section.body && (
                <div className="ms-body">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}
              {section.metrics && (
                <div className="ms-metrics">
                  {section.metrics.map((metric) => (
                    <div className="ms-metric" key={`${metric.value}-${metric.label}`}>
                      <span className="mm-val">{metric.value}</span>
                      <span className="mm-lbl">{metric.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.team && <div className="ms-team">{section.team}</div>}
              {section.stack && (
                <div className="ms-stack">
                  {section.stack.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

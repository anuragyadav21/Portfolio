import { useEffect, useRef } from "react";
import { SectionHeader } from "./SectionHeader";

export function StackSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "v-model-resize" || !iframeRef.current) return;
      iframeRef.current.style.height = `${event.data.height}px`;
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section id="stack" className="sec vmodel-section dark-section">
      <SectionHeader
        number="04"
        title="Work across the full Systems lifecycle V-model"
        kicker="Projects spanning requirements, architecture, modeling, V&V, and operations · click a node"
        dark
      />
      <p className="sec-sub sec-sub-kicker" data-reveal="up">
        <span className="vmodel-kicker">Projects mapped to the systems engineering lifecycle</span>
        Each case study sits in a different phase of the V-model, from architecture definition through modeling,
        implementation, verification, and operational validation.
      </p>
      <div className="vmodel-embed" data-reveal="up">
        <iframe
          ref={iframeRef}
          className="vmodel-frame"
          src="/v-model-portfolio.html"
          title="SE V-Model — project map across the systems engineering lifecycle"
          loading="lazy"
        />
      </div>
    </section>
  );
}

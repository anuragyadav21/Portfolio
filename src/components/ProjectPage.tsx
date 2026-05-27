import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { htmlProjects } from "../data/htmlProjects";
import { profile } from "../data/profile";

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const project = htmlProjects.find((p) => p.id === id);

  useEffect(() => {
    document.title = project
      ? `${project.title} — ${profile.name}`
      : `${profile.name} | Infrastructure Systems Portfolio`;
    return () => {
      document.title = `${profile.name} | Infrastructure Systems Portfolio`;
    };
  }, [project]);

  const handleLoad = () => {
    iframeRef.current?.contentWindow?.scrollTo(0, 0);
  };

  if (!project) return null;

  const effectiveHtmlFile = project.htmlFile;

  const src = `/projects/Claude projects/${encodeURIComponent(effectiveHtmlFile)}`;

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={project?.title}
      onLoad={handleLoad}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
    />
  );
}

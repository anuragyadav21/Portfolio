import { useEffect } from "react";
import { scrollToProjectCard } from "../data/vmodelProjects";

export function useVModelProjectNavigation(): void {
  useEffect(() => {
    const onGoto = (event: Event) => {
      const id = (event as CustomEvent<{ projectId: string }>).detail?.projectId;
      if (id) scrollToProjectCard(id);
    };

    const onHash = () => {
      const match = location.hash.match(/^#project-card-(.+)$/);
      if (match?.[1]) scrollToProjectCard(match[1]);
    };

    window.addEventListener("vmodel-goto-project", onGoto);
    window.addEventListener("hashchange", onHash);
    onHash();

    return () => {
      window.removeEventListener("vmodel-goto-project", onGoto);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
}

/** V-model node keys → htmlProjects ids (section 03 cards). */
export const vmodelProjectIds: Record<string, string> = {
  ruga: "ruga_project_v2-(3)",
  mbse: "mbse_bus_shelter-(1)",
  rag: "rag_lab_multimodal_project",
  wind: "turbine_digital_twin_project",
  llm: "llm_simulation_project",
  ivv: "ivv_local_gemma_llm_project",
  sched: "infra_scheduling_project",
  news: "news_app_project-(1)",
};

export function projectCardDomId(projectId: string): string {
  return `project-card-${projectId}`;
}

export function scrollToProjectCard(projectId: string): void {
  const el = document.getElementById(projectCardDomId(projectId));
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("pc-highlight");
  window.setTimeout(() => el.classList.remove("pc-highlight"), 2800);
}

import { useEffect } from "react";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
  );
}

function markVisible(el: Element): void {
  el.setAttribute("data-visible", "");
}

function setupRevealGroups(): void {
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const children = group.querySelectorAll(":scope > [data-reveal]");
    children.forEach((child, index) => {
      if (!child.hasAttribute("data-delay")) {
        child.setAttribute("data-delay", String(Math.min(index + 1, 5)));
      }
    });
  });
}

function setupRevealObserver(reduced: boolean): () => void {
  const elements = document.querySelectorAll("[data-reveal]");

  if (reduced) {
    elements.forEach(markVisible);
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        markVisible(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: "48px 0px -4% 0px" },
  );

  elements.forEach((el) => {
    if (el.hasAttribute("data-visible")) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      markVisible(el);
    } else {
      observer.observe(el);
    }
  });

  return () => observer.disconnect();
}

function setupSectionObserver(reduced: boolean): () => void {
  const sections = document.querySelectorAll("main > section");

  if (reduced) {
    sections.forEach((s) => s.classList.add("section-visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("section-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}

/** Scroll reveals and section visibility (no parallax — keeps layout stable). */
export function useScrollMotion(): void {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    setupRevealGroups();

    const cleanupReveal = setupRevealObserver(reduced);
    const cleanupSections = setupSectionObserver(reduced);

    return () => {
      cleanupReveal();
      cleanupSections();
    };
  }, []);
}

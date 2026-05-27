import { useEffect, useState } from "react";

type PageIntroLoaderProps = {
  children: React.ReactNode;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function PageIntroLoader({ children }: PageIntroLoaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReady(true);
      return;
    }

    const raf = window.requestAnimationFrame(() => {
      window.setTimeout(() => setReady(true), 140);
    });

    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={ready ? "app-shell app-ready" : "app-shell"}>
      <div className={ready ? "app-loader app-loader-out" : "app-loader"} aria-hidden="true">
        <div className="app-loader-bar" />
        <div className="app-loader-line" />
      </div>
      {children}
    </div>
  );
}


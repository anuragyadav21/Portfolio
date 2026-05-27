import { useMemo } from "react";
import { useVModelProjectNavigation } from "./hooks/useVModelProjectNavigation";
import { useScrollMotion } from "./hooks/useScrollMotion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectPage } from "./components/ProjectPage";
import { ContactSection } from "./components/ContactSection";
import { FieldWorkSection } from "./components/FieldWorkSection";
import { Hero } from "./components/Hero";
import { LifeOutsideEngineeringSection } from "./components/LifeOutsideEngineeringSection";
import { Nav } from "./components/Nav";
import { ProjectsSection } from "./components/ProjectsSection";
import { StackSection } from "./components/StackSection";
import { CornellChangedSection, WhyFitsSection } from "./components/WorkingSection";
import { PageIntroLoader } from "./components/PageIntroLoader";
import { getAudienceVariant } from "./data/identityVariants";

function Home() {
  useVModelProjectNavigation();
  useScrollMotion();

  const audience = useMemo(
    () => getAudienceVariant(new URLSearchParams(window.location.search).get("for")),
    []
  );
  return (
    <PageIntroLoader>
      <Nav />
      <main>
        <Hero audience={audience} />
        <FieldWorkSection />
        <WhyFitsSection />
        <ProjectsSection audience={audience} />
        <StackSection />
        <CornellChangedSection />
        <LifeOutsideEngineeringSection />
        <ContactSection />
      </main>
    </PageIntroLoader>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

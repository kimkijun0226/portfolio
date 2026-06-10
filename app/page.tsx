"use client";

import { useCallback } from "react";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { ThreeBackground } from "@/components/ThreeBackground";
import { sectionIds, sections } from "@/data/sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useGsapScrollReveal } from "@/hooks/useGsapScrollReveal";
import { useScrollRoot } from "@/hooks/useScrollRoot";
import { getSectionOffsetTop } from "@/lib/scroll-utils";
import { ds } from "@/lib/design-system";

const placeholderSections = sections.filter(
  (section) =>
    section.id !== "about" &&
    section.id !== "experience" &&
    section.id !== "projects"
);

export default function Home() {
  const { wrapperRef, contentRef } = useScrollRoot();

  const activeId = useActiveSection(sectionIds, wrapperRef, contentRef);

  useGsapScrollReveal(wrapperRef);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId);
      const wrapper = wrapperRef.current;
      const content = contentRef.current;

      if (!target || !wrapper || !content) {
        return;
      }

      const top = getSectionOffsetTop(target, content);
      wrapper.scrollTop = top;
    },
    [wrapperRef, contentRef]
  );

  return (
    <>
      <ThreeBackground />
      <Header activeId={activeId} onNavigate={scrollToSection} />

      <main ref={wrapperRef} data-scroll-root className={ds.layout.page}>
        <div ref={contentRef}>
          <HeroSection />
          <ExperienceSection
            wrapperRef={wrapperRef}
            contentRef={contentRef}
          />
          <ProjectsSection
            wrapperRef={wrapperRef}
            contentRef={contentRef}
          />

          {placeholderSections.map((section) => (
            <SectionPlaceholder key={section.id} section={section} />
          ))}
        </div>
      </main>
    </>
  );
}

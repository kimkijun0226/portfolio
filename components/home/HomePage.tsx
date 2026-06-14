"use client";

import { useCallback } from "react";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ThreeBackground } from "@/components/effects/ThreeBackground";
import type { Project } from "@/data/projects";
import { projectsIntro } from "@/data/projects";
import { sectionIds } from "@/data/sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useGsapScrollReveal } from "@/hooks/useGsapScrollReveal";
import { useScrollEndClamp } from "@/hooks/useScrollEndClamp";
import { useScrollRoot } from "@/hooks/useScrollRoot";
import { getSectionScrollTarget } from "@/lib/scroll/utils";
import { ds } from "@/lib/design-system";

type HomePageProps = {
  projects: Project[];
};

export function HomePage({ projects }: HomePageProps) {
  const { wrapperRef, contentRef } = useScrollRoot();

  useScrollEndClamp(wrapperRef, contentRef);

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

      wrapper.scrollTop = getSectionScrollTarget(
        sectionId,
        target,
        content,
        wrapper
      );
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
            projects={projects}
            projectsIntro={projectsIntro}
            wrapperRef={wrapperRef}
            contentRef={contentRef}
          />
          <SkillsSection />
          <ContactSection onNavigate={scrollToSection} />
        </div>
      </main>
    </>
  );
}

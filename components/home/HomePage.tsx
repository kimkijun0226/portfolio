"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ThreeBackgroundLazy } from "@/components/effects/ThreeBackgroundLazy";
import type { Project } from "@/data/projects";
import { projectsIntro } from "@/data/projects";
import { sectionIds } from "@/data/sections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useGsapScrollReveal } from "@/hooks/useGsapScrollReveal";
import { usePageEntryReady } from "@/hooks/usePageEntryReady";
import { useScrollEndClamp } from "@/hooks/useScrollEndClamp";
import { useScrollRoot } from "@/hooks/useScrollRoot";
import { getSectionScrollTarget } from "@/lib/scroll/utils";
import { ds } from "@/lib/design-system";

/**
 * [성능] SkillsSection 코드 스플릿
 *
 * 이전 문제: 정적 import 시 data/skills.ts의 react-icons 수십 개가
 * 첫 방문 JS 번들에 포함됨 (화면 아래 섹션인데도 즉시 로드).
 *
 * ssr: false — 서버 HTML에는 넣지 않고, 클라이언트에서 별도 청크로 받아옵니다.
 */
const SkillsSection = dynamic(
  () =>
    import("@/components/sections/SkillsSection").then(
      (module) => module.SkillsSection
    ),
  { ssr: false }
);

type HomePageProps = {
  projects: Project[];
};

export function HomePage({ projects }: HomePageProps) {
  const { wrapperRef, contentRef } = useScrollRoot();
  const { isReady: entryReady, markSceneReady } = usePageEntryReady();

  useScrollEndClamp(wrapperRef, contentRef);

  const activeId = useActiveSection(sectionIds, wrapperRef, contentRef);

  useGsapScrollReveal(wrapperRef, entryReady);

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
      <ThreeBackgroundLazy onSceneReady={markSceneReady} />
      <Header activeId={activeId} onNavigate={scrollToSection} />

      <main ref={wrapperRef} data-scroll-root className={ds.layout.page}>
        <div ref={contentRef}>
          <HeroSection entryReady={entryReady} />
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

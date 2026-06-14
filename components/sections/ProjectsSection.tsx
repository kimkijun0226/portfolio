"use client";

import { type RefObject, useRef } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/data/projects";
import { useProjectsHorizontalScroll } from "@/hooks/useProjectsHorizontalScroll";
import { ds } from "@/lib/design-system";

type ProjectsSectionProps = {
  projects: Project[];
  projectsIntro: string;
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
};

export function ProjectsSection({
  projects,
  projectsIntro,
  wrapperRef,
  contentRef,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideCount = projects.length;

  const { activeIndex } = useProjectsHorizontalScroll(
    sectionRef,
    viewportRef,
    trackRef,
    wrapperRef,
    contentRef,
    slideCount
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`${ds.layout.sectionProjects} relative`}
    >
      {projects.map((project, index) => (
        <div
          key={`snap-${project.id}`}
          data-snap-section
          data-projects-snap={index}
          aria-hidden
          className="pointer-events-none absolute left-0 w-full"
          style={{ top: 0, height: 1 }}
        />
      ))}

      <div
        data-projects-sticky
        className="sticky top-0 h-svh w-full overflow-hidden"
      >
        <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-3 pb-8 sm:gap-4">
          <header data-reveal className={`${ds.layout.sectionContent} shrink-0`}>
            <h2 className={ds.layout.sectionTitle}>Projects</h2>
            <p className={ds.layout.sectionIntro}>{projectsIntro}</p>
          </header>

          <div
            ref={viewportRef}
            data-reveal
            data-reveal-delay="0.12"
            className="w-full shrink-0 overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex h-auto min-h-0 max-h-none will-change-transform lg:h-full lg:max-h-[min(58vh,32rem)]"
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex h-auto min-h-0 shrink-0 items-stretch justify-center lg:h-full"
                >
                  <div
                    className={`${ds.layout.sectionContent} flex h-auto min-h-0 w-full lg:h-full`}
                  >
                    <ProjectCard project={project} layout="full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex shrink-0 items-center justify-center gap-2"
            data-reveal
            data-reveal-delay="0.2"
          >
            {projects.map((project, index) => (
              <span
                key={project.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-6 bg-fg" : "w-1.5 bg-fg/25"
                }`}
                aria-hidden
              />
            ))}
            <span className="ml-2 text-caption text-muted tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(slideCount).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

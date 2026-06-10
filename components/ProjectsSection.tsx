"use client";

import { type RefObject, useRef } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { projects, projectsIntro } from "@/data/projects";
import { useProjectsHorizontalScroll } from "@/hooks/useProjectsHorizontalScroll";
import { ds } from "@/lib/design-system";

const CONTENT_WIDTH =
  "mx-auto w-full max-w-[min(76rem,94vw)] px-[clamp(1rem,4vw,2.5rem)]";

type ProjectsSectionProps = {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
};

export function ProjectsSection({
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

      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <div
          className={`relative flex h-full w-full flex-col items-center justify-center gap-8 pb-16 ${ds.layout.sectionTitlePad}`}
        >
          <header data-reveal className={`${CONTENT_WIDTH} shrink-0`}>
            <h2 className="text-[clamp(2.25rem,4.5vw,3.25rem)] leading-none font-bold tracking-tight text-fg">
              Projects
            </h2>
            <p className="mt-2 text-body leading-[1.65] text-muted">
              {projectsIntro}
            </p>
          </header>

          <div
            ref={viewportRef}
            data-reveal
            data-reveal-delay="0.12"
            className="flex min-h-0 w-full flex-1 items-center overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex h-[min(58vh,32rem)] will-change-transform"
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex h-full shrink-0 items-center justify-center"
                >
                  <div className={`${CONTENT_WIDTH} h-full`}>
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

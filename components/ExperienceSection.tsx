"use client";

import { type CSSProperties, type RefObject, useRef } from "react";
import { ExperienceCard } from "@/components/ExperienceCard";
import {
  contributedProjects,
  experienceIntro,
  formatPeriod,
} from "@/data/experience";
import { useExperienceTimelineDot } from "@/hooks/useExperienceTimelineDot";
import { ds } from "@/lib/design-system";
import timelineStyles from "./ExperienceTimeline.module.css";

const TIMELINE_X = "0.4375rem";
const firstProject = contributedProjects[0];

type ExperienceSectionProps = {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
};

export function ExperienceSection({
  wrapperRef,
  contentRef,
}: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dotTrackRef = useRef<HTMLSpanElement>(null);
  const dotFaceRef = useRef<HTMLSpanElement>(null);
  const metaCompanyRef = useRef<HTMLParagraphElement>(null);
  const metaPeriodRef = useRef<HTMLTimeElement>(null);

  useExperienceTimelineDot(
    sectionRef,
    listRef,
    dotTrackRef,
    dotFaceRef,
    metaCompanyRef,
    metaPeriodRef,
    wrapperRef,
    contentRef
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      data-snap-section
      className={ds.layout.sectionTall}
    >
      <div
        className={`overflow-visible px-[5%] pb-32 ${ds.layout.sectionTitlePad}`}
      >
        <div className="mx-auto w-full max-w-[90%] overflow-visible">
          <header data-reveal className="mb-12">
            <h2 className="mb-3 text-[clamp(2.25rem,4.5vw,3.25rem)] leading-none font-bold tracking-tight text-fg">
              Experience
            </h2>
            <p className="text-body leading-[1.65] text-muted">
              {experienceIntro}
            </p>
          </header>

          <ul
            ref={listRef}
            className="relative flex flex-col gap-16 overflow-visible sm:gap-20"
          >
            <div
              className="pointer-events-none absolute top-3 bottom-3 border-l border-dashed border-fg/25"
              style={{ left: TIMELINE_X }}
              aria-hidden
            />

            <span className={timelineStyles.metaTrack} aria-hidden>
              <p
                ref={metaCompanyRef}
                className="text-[0.6875rem] leading-snug font-medium text-fg/75"
              >
                {firstProject?.company}
              </p>
              <time
                ref={metaPeriodRef}
                dateTime={firstProject?.period.replace(/\s*—\s*/, "/") ?? ""}
                className="mt-1.5 block text-[0.75rem] leading-relaxed tracking-tight text-muted tabular-nums"
              >
                {firstProject ? formatPeriod(firstProject.period) : ""}
              </time>
            </span>

            <span
              ref={dotTrackRef}
              className={timelineStyles.dotTrack}
              aria-hidden
            >
              <span
                ref={dotFaceRef}
                className={timelineStyles.dot}
                style={
                  {
                    "--project-color": firstProject?.color ?? "#ffffff",
                  } as CSSProperties
                }
              />
            </span>

            {contributedProjects.map((project) => (
              <li
                key={project.id}
                data-timeline-item
                data-color={project.color}
                data-company={project.company}
                data-period={project.period}
                className="relative overflow-visible pl-8"
              >
                <ExperienceCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

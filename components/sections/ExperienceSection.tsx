"use client";

import { type CSSProperties, type RefObject, useRef } from "react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import timelineStyles from "@/components/experience/ExperienceTimeline.module.css";
import {
  contributedProjects,
  experienceIntro,
  formatPeriod,
} from "@/data/experience";
import { useExperienceTimelineDot } from "@/hooks/useExperienceTimelineDot";
import { ds } from "@/lib/design-system";

const TIMELINE_X = "0.4375rem";

type ExperienceSectionProps = {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
};

export function ExperienceSection({
  wrapperRef,
  contentRef,
}: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const firstProject = contributedProjects[0];

  useExperienceTimelineDot(
    sectionRef,
    timelineRef,
    listRef,
    trackerRef,
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
        className={`${ds.layout.sectionContent} overflow-visible ${ds.layout.sectionBottomPad} ${ds.layout.sectionTitlePad}`}
      >
        <header data-reveal className="mb-10 sm:mb-12">
          <h2 className={ds.layout.sectionTitle}>Experience</h2>
          <p className={ds.layout.sectionIntro}>{experienceIntro}</p>
        </header>

        <div ref={timelineRef} className="relative overflow-visible">
          <div
            className="pointer-events-none absolute top-3 bottom-3 border-l border-dashed border-fg/25"
            style={{ left: TIMELINE_X }}
            aria-hidden
          />

          <div
            ref={trackerRef}
            data-timeline-tracker
            className={timelineStyles.tracker}
            style={
              {
                "--project-color": firstProject.color,
              } as CSSProperties
            }
            aria-hidden
          >
            <div className={timelineStyles.trackerMeta}>
              <p
                data-timeline-company
                className="text-[0.6875rem] leading-snug font-medium text-fg/75"
              >
                {firstProject.company}
              </p>
              <time
                data-timeline-period
                dateTime={firstProject.period.replace(/\s*—\s*/, "/")}
                className="mt-1.5 block text-[0.75rem] leading-relaxed tracking-tight text-muted tabular-nums"
              >
                {formatPeriod(firstProject.period)}
              </time>
            </div>

            <span className={timelineStyles.trackerDot}>
              <span
                data-timeline-dot-core
                className={timelineStyles.trackerDotCore}
              />
            </span>
          </div>

          <ul
            ref={listRef}
            className="relative flex flex-col gap-16 overflow-visible sm:gap-20"
          >
            {contributedProjects.map((project, index) => (
              <li
                key={project.id}
                data-timeline-item
                data-color={project.color}
                data-company={project.company}
                data-period={formatPeriod(project.period)}
                data-period-raw={project.period}
                data-timeline-active={index === 0 ? "" : undefined}
                className="relative overflow-visible pl-8"
                style={
                  index === 0
                    ? ({ "--item-color": project.color } as CSSProperties)
                    : undefined
                }
              >
                <ExperienceCard
                  project={project}
                  revealDelay={index * 0.08}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

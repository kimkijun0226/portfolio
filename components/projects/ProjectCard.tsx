import Image from "next/image";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  layout?: "default" | "full";
};

const actionClassName =
  "inline-flex items-center gap-2 rounded-full border border-fg/20 px-5 py-2.5 text-caption font-medium text-fg transition-colors";

const actionLinkClassName = `${actionClassName} cursor-pointer hover:border-fg/40 hover:bg-fg/5`;

export function ProjectCard({ project, layout = "default" }: ProjectCardProps) {
  const isFull = layout === "full";

  return (
    <article
      className={`grid h-auto min-h-0 w-full grid-cols-1 content-start gap-4 overflow-visible ${
        isFull
          ? "lg:h-full lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-8"
          : "lg:h-full lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-center lg:gap-10"
      }`}
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden rounded-2xl border border-fg/10 bg-fg/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${
          isFull
            ? "aspect-[16/9] max-h-[9.5rem] sm:max-h-[11.5rem] md:max-h-[13.5rem] lg:aspect-auto lg:max-h-none lg:h-[min(50vh,30rem)]"
            : "h-[min(34vh,16rem)] sm:h-[min(38vh,18rem)] lg:aspect-[4/3] lg:h-auto lg:max-h-[20rem]"
        }`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            className="object-cover"
            sizes={
              isFull
                ? "(max-width: 1024px) 92vw, 52vw"
                : "(max-width: 1024px) 90vw, 42vw"
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-caption text-muted">
            이미지 준비 중
          </div>
        )}
      </div>

      <div className="flex min-h-0 shrink flex-col justify-start text-left lg:justify-center">
        <span className="mb-1.5 text-label font-semibold tracking-label text-muted uppercase sm:mb-2">
          {project.tag}
        </span>
        <h3 className="text-[clamp(1.25rem,2.8vw,1.875rem)] leading-tight font-bold tracking-tight text-fg">
          {project.title}
        </h3>
        <p className="mt-2 text-body leading-[1.6] text-muted sm:mt-3 sm:leading-[1.65]">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
          {project.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-fg/10 px-3 py-1 text-xs leading-tight text-fg/85 backdrop-blur-md"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-4 flex shrink-0 flex-wrap gap-2 sm:mt-6 sm:gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={actionLinkClassName}
            >
              페이지 이동
              <HiArrowTopRightOnSquare className="size-3.5" aria-hidden />
            </a>
          ) : (
            <span className={actionClassName}>
              페이지 이동
              <HiArrowTopRightOnSquare className="size-3.5" aria-hidden />
            </span>
          )}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={actionLinkClassName}
            >
              GitHub
              <FaGithub className="size-3.5" aria-hidden />
            </a>
          ) : (
            <span className={actionClassName}>
              GitHub
              <FaGithub className="size-3.5" aria-hidden />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

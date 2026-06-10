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
      className={`grid h-full w-full grid-cols-1 items-center gap-6 ${
        isFull
          ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-8"
          : "lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-10"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-fg/10 bg-fg/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${
          isFull
            ? "aspect-[16/11] lg:aspect-auto lg:h-[min(50vh,30rem)]"
            : "h-[min(34vh,16rem)] sm:h-[min(38vh,18rem)] lg:aspect-[4/3] lg:h-auto lg:max-h-[20rem]"
        }`}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes={
            isFull
              ? "(max-width: 1024px) 92vw, 52vw"
              : "(max-width: 1024px) 90vw, 42vw"
          }
        />
      </div>

      <div className="flex min-h-0 flex-col justify-center text-left">
        <span className="mb-2 text-label font-semibold tracking-label text-muted uppercase">
          {project.tag}
        </span>
        <h3 className="text-[clamp(1.375rem,2.8vw,1.875rem)] leading-tight font-bold tracking-tight text-fg">
          {project.title}
        </h3>
        <p className="mt-3 text-body leading-[1.65] text-muted">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-fg/10 px-3 py-1 text-xs leading-tight text-fg/85 backdrop-blur-md"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-6 flex shrink-0 flex-wrap gap-3">
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

import type { ContributedProject } from "@/data/experience";

type ExperienceCardProps = {
  project: ContributedProject;
  revealDelay?: number;
};

export function ExperienceCard({
  project,
  revealDelay = 0,
}: ExperienceCardProps) {
  return (
    <article
      data-reveal
      data-reveal-delay={revealDelay > 0 ? String(revealDelay) : undefined}
      className="relative overflow-hidden rounded-2xl border border-fg/10 border-l-[3px] bg-bg/90 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-[transform,border-color,box-shadow] duration-300 ease-out before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-fg/[0.05] before:to-transparent hover:-translate-y-0.5 hover:border-fg/18 hover:shadow-[0_16px_48px_rgba(0,0,0,0.28)]"
      style={{ borderLeftColor: project.color }}
    >
      <div className="relative z-10 p-6">
        <header className="mb-4">
          <p
            className="mb-2 text-[0.6875rem] font-semibold tracking-wide"
            style={{ color: project.color }}
          >
            {project.category}
          </p>
          <h3 className="text-[1.375rem] leading-tight font-bold tracking-tight text-fg">
            {project.title}
          </h3>
          <p className="mt-1.5 text-role font-medium text-fg/80">
            {project.role}
          </p>
        </header>

        <p className="mb-5 text-body leading-[1.65] text-muted">
          {project.summary}
        </p>

        <div className="border-t border-fg/10 pt-5">
          <p className="mb-3 text-label font-semibold tracking-label text-muted uppercase">
            주요 성과
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-4.5 text-caption leading-[1.65] text-fg/70 marker:text-fg/40">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-t border-fg/10 pt-5">
          <p className="mb-3 text-label font-semibold tracking-label text-muted uppercase">
            사용 기술
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-fg/10 bg-fg/[0.04] px-3 py-1 text-xs leading-tight text-fg/85"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

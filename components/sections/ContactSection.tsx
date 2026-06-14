"use client";

import { toast } from "sonner";
import { FaGithub } from "react-icons/fa";
import { HiArrowRight, HiEnvelope } from "react-icons/hi2";
import { contact } from "@/data/contact";
import { ds } from "@/lib/design-system";

type ContactSectionProps = {
  onNavigate?: (sectionId: string) => void;
};

export function ContactSection({ onNavigate }: ContactSectionProps) {
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      toast.success("이메일이 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <section
      id="contact"
      data-snap-section
      className="relative flex min-h-svh shrink-0 flex-col"
    >
      <div className="flex flex-1 flex-col justify-center py-16 sm:py-20">
        <div className={ds.layout.sectionContent}>
          <p
            data-reveal
            className="text-body leading-relaxed text-muted"
          >
            {contact.greeting}
          </p>

          <button
            type="button"
            data-reveal
            data-reveal-delay="0.08"
            onClick={handleCopyEmail}
            className="mt-6 block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-[clamp(2rem,7.5vw,4.75rem)] leading-[1.05] font-bold tracking-tight text-fg transition-opacity hover:opacity-80"
          >
            {contact.email}
          </button>

          <div
            data-reveal-stagger
            className="mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 md:gap-12"
          >
            <p
              data-reveal-item
              className="text-body leading-[1.75] text-muted"
            >
              {contact.inquiry}
            </p>
            <div data-reveal-item className="text-body leading-[1.75] text-muted">
              <p>{contact.coffeeChat}</p>
              <p className="mt-4">{contact.closing}</p>
            </div>
          </div>

          <div
            data-reveal
            data-reveal-delay="0.18"
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-10"
          >
            <a
              href={`mailto:${contact.email}`}
              className="group inline-flex cursor-pointer items-center gap-2 text-body font-medium text-fg transition-colors hover:text-fg/80"
            >
              {contact.mailCta}
              <HiArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex cursor-pointer items-center gap-2 text-body font-medium text-fg transition-colors hover:text-fg/80"
            >
              {contact.githubCta}
              <HiArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </a>
          </div>
        </div>
      </div>

      <footer
        data-reveal
        data-reveal-delay="0.1"
        className="border-t border-fg/10 py-12 sm:py-14"
      >
        <div className={`${ds.layout.sectionContent} grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8`}>
          <div>
            <p className="text-[1.125rem] font-semibold text-fg">
              {contact.footer.name}
            </p>
            <p className="mt-1 text-caption text-muted">{contact.footer.role}</p>
            <p className="mt-4 max-w-xs text-caption leading-[1.7] text-muted">
              {contact.footer.bio}
            </p>
          </div>

          <div>
            <p className="text-label font-semibold tracking-label text-fg uppercase">
              Connect
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {contact.connect.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex cursor-pointer items-center gap-2 text-caption text-muted transition-colors hover:text-fg"
                  >
                    {item.id === "github" ? (
                      <FaGithub className="size-3.5" aria-hidden />
                    ) : (
                      <HiEnvelope className="size-3.5" aria-hidden />
                    )}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label font-semibold tracking-label text-fg uppercase">
              Quick Links
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {contact.quickLinks.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(item.id)}
                    className="cursor-pointer border-0 bg-transparent p-0 text-caption text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </section>
  );
}

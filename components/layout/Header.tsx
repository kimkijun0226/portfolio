"use client";

import { CopyEmail } from "@/components/ui/CopyEmail";
import { Logo } from "@/components/layout/Logo";
import { SectionNav } from "@/components/layout/SectionNav";

type HeaderProps = {
  activeId: string;
  onNavigate: (sectionId: string) => void;
};

export function Header({ activeId, onNavigate }: HeaderProps) {
  return (
    <header className="pointer-events-none fixed inset-x-3 top-3 z-50 mx-auto max-w-[calc(100%-1.5rem)] sm:inset-x-page sm:max-w-[calc(100%-var(--spacing-page)*2)]">
      <div
        data-reveal-immediate
        data-reveal-delay="0"
        className="pointer-events-auto relative flex h-header items-center justify-between overflow-visible rounded-2xl border border-fg/10 bg-bg/30 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 sm:px-5 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-fg/[0.07] before:to-transparent"
      >
        <Logo className="relative z-10" />
        <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <SectionNav activeId={activeId} onNavigate={onNavigate} />
        </div>
        <CopyEmail className="relative z-10" />
      </div>
    </header>
  );
}

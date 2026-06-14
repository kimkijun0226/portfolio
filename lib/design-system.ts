export const ds = {
  type: {
    label:
      "text-label leading-none font-medium tracking-label uppercase text-muted",
    caption: "text-caption leading-normal text-muted",
    body: "text-body leading-normal text-muted",
    bio: "text-bio leading-[1.65] text-muted",
    role: "text-role leading-snug font-medium text-fg",
    lead: "text-lead leading-snug font-normal tracking-tight text-fg",
    display:
      "text-display leading-none font-bold tracking-display text-fg",
    header: "text-caption font-normal text-muted",
    sectionTitle:
      "text-[clamp(2.5rem,5vw,4rem)] leading-none font-bold tracking-tight",
  },
  layout: {
    line: "block whitespace-nowrap max-sm:whitespace-normal max-sm:break-keep",
    page: "relative z-10 h-full min-h-0 overflow-y-auto overscroll-y-contain",
    sectionShell: "relative h-svh max-h-svh shrink-0 overflow-hidden",
    sectionTall: "relative min-h-dvh shrink-0",
    sectionProjects: "relative shrink-0",
    sectionContent:
      "mx-auto w-full max-w-[min(76rem,94vw)] px-4 sm:px-page",
    sectionBottomPad: "pb-[calc(4rem+50dvh)]",
    sectionTitle:
      "text-[clamp(2.25rem,4.5vw,3.25rem)] leading-none font-bold tracking-tight text-fg",
    sectionIntro: "mt-2 max-w-2xl text-body leading-[1.65] text-muted",
    hero:
      "relative flex h-full items-center justify-center px-4 pb-16 sm:px-page",
    section:
      "flex min-h-dvh items-center justify-center px-4 pb-16 sm:px-page",
    sectionTitlePad:
      "pt-[calc(var(--spacing-header)*2+0.75rem)]",
    sectionStickyPad:
      "pt-[calc(var(--spacing-header)+1.25rem)]",
    sectionWithTitle:
      "flex h-full flex-col justify-center px-4 pb-16 sm:px-page",
    grid:
      "mx-auto grid w-fit max-w-[80vw] grid-cols-1 items-start gap-block lg:grid-cols-[auto_auto] lg:gap-col",
    col: "min-w-0 text-left",
    focusWrap: "flex w-full max-w-[min(20rem,80vw)] flex-wrap gap-2",
  },
  space: {
    label: "mb-2.5",
    lead: "mb-5",
    display: "mb-6",
    bio: "mb-0",
    stackSm: "mt-1.5",
    asideBlock: "mb-10",
  },
  chip:
    "inline-flex items-center gap-1.5 rounded-full border border-fg/40 px-3 py-1.5 text-caption leading-none whitespace-nowrap text-fg",
} as const;

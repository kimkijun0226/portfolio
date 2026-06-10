import type { Section } from "@/data/sections";
import { ds } from "@/lib/design-system";

type SectionPlaceholderProps = {
  section: Section;
};

export function SectionPlaceholder({ section }: SectionPlaceholderProps) {
  return (
    <section
      id={section.id}
      data-snap-section
      className={ds.layout.sectionShell}
    >
      <div
        className={`${ds.layout.sectionWithTitle} ${ds.layout.sectionTitlePad}`}
      >
        <h2
          data-reveal
          className={ds.type.sectionTitle}
          style={{ color: section.color }}
        >
          {section.label}
        </h2>
      </div>
      <div className={ds.layout.sectionSnapPad} aria-hidden />
    </section>
  );
}

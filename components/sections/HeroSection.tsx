import { FocusChip } from "@/components/ui/FocusChip";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { TypingText } from "@/components/ui/TypingText";
import { focusItems } from "@/data/focus";
import { profile } from "@/data/profile";
import {
  TYPING_SPEED,
  TYPING_START,
  getSecondLineTypingDelay,
} from "@/lib/hero-animation";
import { ds } from "@/lib/design-system";

type HeroSectionProps = {
  entryReady?: boolean;
};

export function HeroSection({ entryReady = false }: HeroSectionProps) {
  return (
    <section id="about" data-snap-section className={ds.layout.sectionShell}>
      <div className={ds.layout.hero}>
        <div className={ds.layout.grid}>
          <div className={ds.layout.col}>
            <div
              data-reveal-immediate
              data-reveal-delay="0.1"
              className={`${ds.layout.line} ${ds.type.label} ${ds.space.label}`}
            >
              {profile.label}
            </div>

            <div
              data-reveal-immediate
              data-reveal-delay="0.2"
              className={`${ds.layout.line} ${ds.type.lead} ${ds.space.lead}`}
            >
              {profile.lead}
            </div>

            <div data-reveal-immediate data-reveal-delay="0.3">
              <h1
                className={`${ds.layout.line} ${ds.type.display} ${ds.space.display}`}
              >
                {profile.name}
              </h1>
            </div>

            <div className={ds.type.bio}>
              <TypingText
                text={profile.bioLine1}
                className={`${ds.layout.line} min-h-[1.65em]`}
                delay={TYPING_START}
                speed={TYPING_SPEED}
                active={entryReady}
              />
              <TypingText
                text={profile.bioLine2}
                className={`${ds.layout.line} mt-1 min-h-[1.65em]`}
                delay={getSecondLineTypingDelay()}
                speed={TYPING_SPEED}
                active={entryReady}
              />
            </div>

            <div
              data-reveal-immediate
              data-reveal-delay="0.65"
              className={`${ds.layout.line} ${ds.type.caption} mt-6`}
            >
              {profile.meta}
            </div>
          </div>

          <aside className={`${ds.layout.col} lg:pt-1`}>
            <div
              data-reveal-immediate
              data-reveal-delay="0.45"
              className={ds.space.asideBlock}
            >
              <p className={`${ds.type.label} ${ds.space.label}`}>CURRENTLY</p>
              <p className={`${ds.layout.line} ${ds.type.role}`}>
                {profile.currently.role}
              </p>
              <p
                className={`${ds.layout.line} ${ds.type.body} ${ds.space.stackSm}`}
              >
                {profile.currently.status}
              </p>
              <p
                className={`${ds.layout.line} ${ds.type.caption} ${ds.space.stackSm}`}
              >
                {profile.currently.period}
              </p>
            </div>

            <div data-reveal-immediate data-reveal-delay="0.6">
              <p className={`${ds.type.label} ${ds.space.label}`}>FOCUS</p>
              <div className={ds.layout.focusWrap}>
                {focusItems.map(({ name, Icon }) => (
                  <FocusChip key={name} name={name} Icon={Icon} />
                ))}
              </div>
            </div>
          </aside>
        </div>

        <ScrollIndicator />
      </div>
    </section>
  );
}

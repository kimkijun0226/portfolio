"use client";

import type { CSSProperties } from "react";
import type { SkillCategory } from "@/data/skills";
import { useCardTilt } from "@/hooks/useCardTilt";
import styles from "./SkillsSection.module.css";

type SkillCategoryCardProps = {
  category: SkillCategory;
  onSkillClick: (skillId: string) => void;
};

export function SkillCategoryCard({
  category,
  onSkillClick,
}: SkillCategoryCardProps) {
  const {
    cardRef,
    onMouseMove,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    transform,
    glareX,
    glareY,
    isActive,
  } = useCardTilt();

  return (
    <div className={styles.cardStage}>
      <article
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        className={`${styles.floatCard} ${isActive ? styles.floatCardActive : styles.floatCardResting} rounded-2xl border border-fg/10 bg-bg/45 p-5 backdrop-blur-md sm:p-6`}
        style={
          {
            "--card-accent": category.accent,
            "--glare-x": `${glareX}%`,
            "--glare-y": `${glareY}%`,
            transform,
          } as CSSProperties
        }
      >
        <div className={styles.cardGlare} aria-hidden />
        <div className={styles.cardSurface}>
          <header className="mb-4 border-b border-fg/8 pb-4">
            <p
              className="text-label font-semibold tracking-label uppercase"
              style={{ color: category.accent }}
            >
              {category.title}
            </p>
            <p className="mt-1 text-caption text-muted">{category.subtitle}</p>
          </header>

          <ul className="flex flex-wrap gap-2">
            {category.skills.map((skill) => {
              const Icon = skill.Icon;

              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    onClick={() => onSkillClick(skill.id)}
                    className={`${styles.skillBtn} inline-flex cursor-pointer items-center gap-2 rounded-xl border border-fg/10 bg-bg/55 px-3 py-2 text-left`}
                  >
                    <span
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-fg/5"
                      style={{ color: skill.color }}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="text-xs font-medium text-fg/90 sm:text-caption">
                      {skill.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </div>
  );
}

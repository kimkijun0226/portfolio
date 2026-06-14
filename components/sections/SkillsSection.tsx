"use client";

import { useCallback, useMemo, useState } from "react";
import { SkillCategoryCard } from "@/components/skills/SkillCategoryCard";
import { SkillModal } from "@/components/skills/SkillModal";
import { skillCategories, skillsIntro } from "@/data/skills";
import { ds } from "@/lib/design-system";
import styles from "@/components/skills/SkillsSection.module.css";

export function SkillsSection() {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const skillMap = useMemo(() => {
    const map = new Map<string, (typeof skillCategories)[number]["skills"][number]>();

    skillCategories.forEach((category) => {
      category.skills.forEach((skill) => {
        map.set(skill.id, skill);
      });
    });

    return map;
  }, []);

  const activeSkill = activeSkillId ? skillMap.get(activeSkillId) ?? null : null;

  const handleSkillClick = useCallback((skillId: string) => {
    setActiveSkillId(skillId);
  }, []);

  const handleClose = useCallback(() => {
    setActiveSkillId(null);
  }, []);

  return (
    <>
      <section
        id="skills"
        data-snap-section
        className={`${ds.layout.sectionTall} relative overflow-visible`}
      >
        <div
          className={`${ds.layout.sectionContent} ${ds.layout.sectionBottomPad} ${ds.layout.sectionTitlePad}`}
        >
          <header data-reveal className="mb-10 sm:mb-12">
            <h2 className={ds.layout.sectionTitle}>Skills</h2>
            <p className={ds.layout.sectionIntro}>{skillsIntro}</p>
          </header>

          <div
            data-reveal-stagger
            className={`${styles.scene} ${styles.sceneGrid} grid grid-cols-1 gap-5 py-2 sm:gap-6 sm:py-4 lg:grid-cols-2 lg:gap-8 lg:py-6`}
          >
            {skillCategories.map((category) => (
              <div key={category.id} data-reveal-item>
                <SkillCategoryCard
                  category={category}
                  onSkillClick={handleSkillClick}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SkillModal skill={activeSkill} onClose={handleClose} />
    </>
  );
}

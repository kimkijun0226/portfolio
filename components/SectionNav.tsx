"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { sections, type Section } from "@/data/sections";
import styles from "./SectionNav.module.css";

const ENTER_STAGGER_MS = 42;
const EXIT_STAGGER_MS = 22;
const EXIT_DURATION_MS = 180;
const POP_OFFSET_REM = 0.45;

function getExitTotalMs(itemCount: number) {
  return (itemCount - 1) * EXIT_STAGGER_MS + EXIT_DURATION_MS;
}

type SectionNavProps = {
  activeId: string;
  onNavigate: (sectionId: string) => void;
};

export function SectionNav({ activeId, onNavigate }: SectionNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const underlineId = hoveredId ?? activeId;
  const activeSection =
    sections.find((section) => section.id === activeId) ?? sections[0];

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    setIsExiting(false);
    setIsExpanded(true);
  };

  const handleLeave = () => {
    setHoveredId(null);

    if (!isExpanded) {
      return;
    }

    setIsExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      setIsExpanded(false);
      setIsExiting(false);
      exitTimerRef.current = null;
    }, getExitTotalMs(sections.length));
  };

  return (
    <nav
      aria-label="페이지 섹션 내비게이션"
      className={styles.nav}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className={styles.trigger}
        style={
          { "--section-color": activeSection.color } as CSSProperties
        }
      >
        <span className={styles.triggerLabel}>{activeSection.label}</span>
        <span
          className={`${styles.dot} ${styles.dotTrigger}`}
          aria-hidden
        />
      </div>

      <div
        className={`${styles.dropdown} ${isExpanded ? styles.dropdownOpen : ""}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div
          className={`${styles.dropdownPanel} ${
            isExpanded ? styles.dropdownPanelOpen : ""
          }`}
        >
          <ul className={styles.list}>
            {sections.map((section, index) => {
              const enterDelay = index * ENTER_STAGGER_MS;
              const exitDelay =
                (sections.length - 1 - index) * EXIT_STAGGER_MS;
              const delay = isExiting ? exitDelay : enterDelay;

              return (
                <li
                  key={section.id}
                  className={`${styles.listItem} ${
                    isExpanded && !isExiting ? styles.listItemVisible : ""
                  } ${isExiting ? styles.listItemExiting : ""}`}
                  style={
                    {
                      "--item-delay": `${delay}ms`,
                      "--pop-offset": `${POP_OFFSET_REM}rem`,
                    } as CSSProperties
                  }
                >
                  <SectionNavItem
                    section={section}
                    isUnderline={underlineId === section.id}
                    isVisible={isExpanded && !isExiting}
                    onHover={setHoveredId}
                    onNavigate={onNavigate}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

type SectionNavItemProps = {
  section: Section;
  isUnderline: boolean;
  isVisible: boolean;
  onHover: (id: string | null) => void;
  onNavigate: (sectionId: string) => void;
};

function SectionNavItem({
  section,
  isUnderline,
  isVisible,
  onHover,
  onNavigate,
}: SectionNavItemProps) {
  return (
    <button
      type="button"
      className={`${styles.link} ${isUnderline ? styles.linkActive : ""}`}
      style={{ "--section-color": section.color } as CSSProperties}
      onMouseEnter={() => onHover(section.id)}
      onFocus={() => onHover(section.id)}
      onClick={() => onNavigate(section.id)}
    >
      <span className={styles.itemInner}>
        <span className={styles.labelWrap}>
          <span className={styles.label}>{section.label}</span>
          <span className={styles.underline} aria-hidden />
        </span>
        <span
          className={`${styles.description} ${
            isVisible ? styles.descriptionVisible : ""
          }`}
        >
          {section.description}
        </span>
      </span>
    </button>
  );
}

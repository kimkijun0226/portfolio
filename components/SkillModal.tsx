"use client";

import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import type { Skill } from "@/data/skills";
import { skillLevelMeta } from "@/data/skills";
import styles from "./SkillsSection.module.css";

type SkillModalProps = {
  skill: Skill | null;
  onClose: () => void;
};

export function SkillModal({ skill, onClose }: SkillModalProps) {
  useEffect(() => {
    if (!skill) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [skill, onClose]);

  if (!skill) {
    return null;
  }

  const { label, percent } = skillLevelMeta[skill.level];
  const Icon = skill.Icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer border-0 bg-black/65 backdrop-blur-sm"
        aria-label="닫기"
        onClick={onClose}
      />

      <div
        className={`${styles.modalPanel} relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-fg/12 bg-bg/95 shadow-[0_32px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl`}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-80"
          style={{
            background: `linear-gradient(to bottom, color-mix(in srgb, ${skill.color} 28%, transparent), transparent)`,
          }}
          aria-hidden
        />

        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-fg/12 bg-fg/5 text-fg transition-colors hover:bg-fg/10"
            aria-label="닫기"
          >
            <HiXMark className="size-5" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <span
              className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl border border-fg/10 bg-fg/5"
              style={{ color: skill.color }}
            >
              <Icon className="size-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-label font-semibold tracking-label text-muted uppercase">
                Skill Detail
              </p>
              <h3
                id="skill-modal-title"
                className="mt-1 text-[1.5rem] leading-tight font-bold tracking-tight text-fg"
              >
                {skill.name}
              </h3>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-caption font-medium text-fg/85">
                역량 수준
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  color: skill.color,
                  background: `color-mix(in srgb, ${skill.color} 18%, transparent)`,
                }}
              >
                {label}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-fg/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  background: skill.color,
                }}
              />
            </div>
          </div>

          <p className="mt-6 text-body leading-[1.7] text-muted">
            {skill.description}
          </p>
        </div>
      </div>
    </div>
  );
}

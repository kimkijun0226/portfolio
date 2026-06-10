import { profile } from "@/data/profile";

export const TYPING_SPEED = 42;
export const TYPING_START = 900;
export const TYPING_LINE_GAP = 180;
export const SLIDE_IN_DURATION_MS = 750;
export const SLIDE_IN_MAX_DELAY_MS = 650;
export const ANIMATION_BUFFER_MS = 400;

export function getHeroAnimationDuration(): number {
  const typingEnd =
    TYPING_START +
    profile.bioLine1.length * TYPING_SPEED +
    TYPING_LINE_GAP +
    profile.bioLine2.length * TYPING_SPEED;

  const slideEnd = SLIDE_IN_MAX_DELAY_MS + SLIDE_IN_DURATION_MS;

  return Math.max(typingEnd, slideEnd) + ANIMATION_BUFFER_MS;
}

export function getSecondLineTypingDelay(): number {
  return (
    TYPING_START +
    profile.bioLine1.length * TYPING_SPEED +
    TYPING_LINE_GAP
  );
}

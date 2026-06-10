"use client";

import { type RefObject, useRef } from "react";

export function useScrollRoot(): {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
} {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return { wrapperRef, contentRef };
}

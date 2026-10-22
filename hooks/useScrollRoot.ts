"use client";

import { type RefObject, useCallback, useEffect, useRef } from "react";
import { attachMouseDrag } from "@/lib/scroll/mouse-drag";

export function useScrollRoot(): {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  scrollTo: (top: number) => void;
} {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const interactionsRef = useRef<ReturnType<typeof attachMouseDrag> | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      const interactions = attachMouseDrag(wrapper);
      interactionsRef.current = interactions;
      return () => {
        interactions.destroy();
        interactionsRef.current = null;
      };
    }
  }, []);

  const scrollTo = useCallback((top: number) => {
    interactionsRef.current?.scrollTo(top);
  }, []);

  return { wrapperRef, contentRef, scrollTo };
}

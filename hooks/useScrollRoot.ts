"use client";

import { type RefObject, useCallback, useEffect, useRef } from "react";
import { attachScrollController } from "@/lib/scroll/controller";

export function useScrollRoot(): {
  wrapperRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  scrollTo: (top: number) => void;
} {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const interactionsRef = useRef<ReturnType<typeof attachScrollController> | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      const interactions = attachScrollController(wrapper);
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

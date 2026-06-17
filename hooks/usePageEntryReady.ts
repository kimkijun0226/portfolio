"use client";

import { useCallback, useEffect, useState } from "react";

const ENTRY_TIMEOUT_MS = 4000;

export function usePageEntryReady() {
  const [fontsReady, setFontsReady] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  const markSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setSceneReady(true);
    }

    void document.fonts.ready.then(() => {
      setFontsReady(true);
    });

    void import("@/lib/gsap").then(() => {
      setGsapReady(true);
    });

    const timeoutId = window.setTimeout(() => {
      setFontsReady(true);
      setGsapReady(true);
      setSceneReady(true);
    }, ENTRY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const isReady = fontsReady && gsapReady && sceneReady;

  return { isReady, markSceneReady };
}

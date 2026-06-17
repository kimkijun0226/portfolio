"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ThreeBackground = dynamic(
  () =>
    import("@/components/effects/ThreeBackground").then(
      (module) => module.ThreeBackground
    ),
  { ssr: false }
);

type ThreeBackgroundLazyProps = {
  onSceneReady?: () => void;
};

export function ThreeBackgroundLazy({ onSceneReady }: ThreeBackgroundLazyProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      onSceneReady?.();
      return;
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      if (event.matches) {
        onSceneReady?.();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [onSceneReady]);

  if (prefersReducedMotion) {
    return null;
  }

  return <ThreeBackground onSceneReady={onSceneReady} />;
}

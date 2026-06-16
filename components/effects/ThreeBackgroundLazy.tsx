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

function scheduleIdle(task: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    return window.requestIdleCallback(task, { timeout: 2500 });
  }

  return window.setTimeout(task, 1);
}

function cancelIdle(id: number) {
  if (typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
}

export function ThreeBackgroundLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const idleId = scheduleIdle(() => {
      setReady(true);
    });

    return () => {
      cancelIdle(idleId);
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <ThreeBackground />;
}

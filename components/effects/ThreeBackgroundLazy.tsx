"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * [성능] next/dynamic — ThreeBackground 컴포넌트(및 three 패키지)를 별도 JS 청크로 분리합니다.
 * ssr: false — WebGL은 브라우저 전용이라 서버에서 렌더하지 않습니다.
 */
const ThreeBackground = dynamic(
  () =>
    import("@/components/effects/ThreeBackground").then(
      (module) => module.ThreeBackground
    ),
  { ssr: false }
);

/** 브라우저가 idle(한가한) 상태일 때 콜백 실행 — Hero 먼저 그린 뒤 배경 로드 */
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

/**
 * Three.js WebGL 배경 지연 로딩 래퍼
 *
 * 이전 문제: HomePage에서 ThreeBackground를 바로 import하면
 * three(~600KB)가 메인 번들에 포함되어 첫 화면 표시가 늦어짐.
 *
 * 해결: dynamic 청크 분리 + requestIdleCallback으로 마운트 시점을 뒤로 미룸.
 */
type ThreeBackgroundLazyProps = {
  onReady?: () => void;
};

export function ThreeBackgroundLazy({ onReady }: ThreeBackgroundLazyProps) {
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

  useEffect(() => {
    if (!ready) {
      return;
    }

    onReady?.();
  }, [ready, onReady]);

  if (!ready) {
    return null;
  }

  return <ThreeBackground />;
}

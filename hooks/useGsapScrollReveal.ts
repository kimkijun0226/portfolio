"use client";

import { type RefObject, useLayoutEffect } from "react";
import { getScrollFrameIsScrolling } from "@/lib/scroll/frame";

/**
 * GSAP ScrollTrigger 기반 섹션 등장 애니메이션 훅
 *
 * [성능] gsap/ScrollTrigger를 파일 상단 static import하지 않고
 * useLayoutEffect 안에서 import("@/lib/gsap")로 비동기 로드합니다.
 * Hero의 data-reveal-immediate는 globals.css로 먼저 숨긴 뒤,
 * GSAP 청크가 도착하면 fromTo로 등장시킵니다.
 */

const REVEAL_SELECTOR = "[data-reveal]";
const IMMEDIATE_SELECTOR = "[data-reveal-immediate]";
const STAGGER_SELECTOR = "[data-reveal-stagger]";
const STAGGER_ITEM_SELECTOR = "[data-reveal-item]";

const REVEAL_FROM = {
  y: 56,
  opacity: 0,
  scale: 0.9,
} as const;

const REVEAL_TO = {
  y: 0,
  opacity: 1,
  scale: 1,
} as const;

type GsapModule = typeof import("@/lib/gsap");

function createRevealTween(
  gsap: GsapModule["gsap"],
  targets: Parameters<GsapModule["gsap"]["fromTo"]>[0],
  options: {
    scroller?: HTMLElement;
    trigger?: Element;
    delay?: number;
    stagger?: number;
    start?: string;
  }
) {
  const {
    scroller,
    trigger = Array.isArray(targets) ? undefined : (targets as Element),
    delay = 0,
    stagger = 0,
    start = "top 86%",
  } = options;

  const tweenVars: {
    y: number;
    opacity: number;
    scale: number;
    duration: number;
    delay: number;
    stagger?: number;
    ease: string;
    scrollTrigger?: {
      trigger: Element;
      scroller: HTMLElement;
      start: string;
      toggleActions: string;
    };
  } = {
    ...REVEAL_TO,
    duration: 0.9,
    delay,
    stagger: stagger > 0 ? stagger : undefined,
    ease: "back.out(1.6)",
  };

  if (scroller && trigger) {
    tweenVars.scrollTrigger = {
      trigger,
      scroller,
      start,
      toggleActions: "play none none none",
    };
  }

  return gsap.fromTo(targets, REVEAL_FROM, tweenVars);
}

export function useGsapScrollReveal(
  scrollRootRef: RefObject<HTMLElement | null>,
  enabled = true
) {
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const scroller = scrollRootRef.current;

    if (!scroller) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let cleanupImmediate: (() => void) | undefined;
    let cleanupScroll: (() => void) | undefined;

    // [성능] GSAP·ScrollTrigger를 별도 청크로 분리 로드
    void import("@/lib/gsap").then(
      ({ gsap, registerGsapPlugins, ScrollTrigger }) => {
        if (cancelled) {
          return;
        }

        registerGsapPlugins();

        const tweens: ReturnType<GsapModule["gsap"]["fromTo"]>[] = [];
        const triggers: NonNullable<
          ReturnType<GsapModule["gsap"]["fromTo"]>["scrollTrigger"]
        >[] = [];

        // Skills 같은 섹션을 코드 스플릿으로 늦게 로드하면 DOM이 "나중에" 추가됩니다.
        // globals.css가 reveal 대상을 opacity:0으로 숨기기 때문에,
        // 이 훅이 동적으로 추가된 요소까지 스캔해 애니메이션을 붙여야 화면이 정상 노출됩니다.
        const seenImmediate = new WeakSet<HTMLElement>();
        const seenReveal = new WeakSet<HTMLElement>();
        const seenStagger = new WeakSet<HTMLElement>();

        const scan = () => {
          const immediateElements =
            scroller.querySelectorAll<HTMLElement>(IMMEDIATE_SELECTOR);

          immediateElements.forEach((element) => {
            if (seenImmediate.has(element)) {
              return;
            }
            seenImmediate.add(element);

            const delay = Number.parseFloat(element.dataset.revealDelay ?? "0");
            tweens.push(createRevealTween(gsap, element, { delay }));
          });

          const elements =
            scroller.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);

          elements.forEach((element) => {
            if (seenReveal.has(element)) {
              return;
            }
            seenReveal.add(element);

            const delay = Number.parseFloat(element.dataset.revealDelay ?? "0");
            const animation = createRevealTween(gsap, element, {
              scroller,
              trigger: element,
              delay,
            });

            const trigger = animation.scrollTrigger;
            if (trigger) {
              triggers.push(trigger);
            }
          });

          const staggerGroups =
            scroller.querySelectorAll<HTMLElement>(STAGGER_SELECTOR);

          staggerGroups.forEach((group) => {
            if (seenStagger.has(group)) {
              return;
            }

            const items =
              group.querySelectorAll<HTMLElement>(STAGGER_ITEM_SELECTOR);

            if (items.length === 0) {
              return;
            }

            seenStagger.add(group);
            const animation = createRevealTween(gsap, items, {
              scroller,
              trigger: group,
              start: "top 84%",
              stagger: 0.12,
            });

            const trigger = animation.scrollTrigger;
            if (trigger) {
              triggers.push(trigger);
            }
          });

          ScrollTrigger.refresh();
        };

        scan();

        cleanupImmediate = () => {
          tweens.forEach((tween) => tween.kill());
        };

        let scanRafId = 0;
        const scheduleScan = () => {
          if (scanRafId !== 0) {
            return;
          }
          scanRafId = window.requestAnimationFrame(() => {
            scanRafId = 0;
            scan();
          });
        };

        const domObserver = new MutationObserver(scheduleScan);
        domObserver.observe(scroller, { childList: true, subtree: true });

        let scrollTriggerRafId = 0;
        let scrollTriggerSkip = 0;

        const onScroll = () => {
          if (getScrollFrameIsScrolling()) {
            scrollTriggerSkip += 1;

            if (scrollTriggerSkip % 4 !== 0) {
              return;
            }
          } else {
            scrollTriggerSkip = 0;
          }

          if (scrollTriggerRafId !== 0) {
            return;
          }

          scrollTriggerRafId = window.requestAnimationFrame(() => {
            scrollTriggerRafId = 0;
            ScrollTrigger.update();
          });
        };

        scroller.addEventListener("scroll", onScroll, { passive: true });

        const refresh = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", refresh);
        refresh();

        cleanupScroll = () => {
          domObserver.disconnect();
          if (scanRafId !== 0) {
            window.cancelAnimationFrame(scanRafId);
          }
          scroller.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", refresh);
          if (scrollTriggerRafId !== 0) {
            window.cancelAnimationFrame(scrollTriggerRafId);
          }
          triggers.forEach((trigger) => trigger.kill());
        };
      }
    );

    return () => {
      cancelled = true;
      cleanupImmediate?.();
      cleanupScroll?.();
    };
  }, [scrollRootRef, enabled]);
}

"use client";

import { type RefObject, useLayoutEffect } from "react";
import { getScrollFrameIsScrolling } from "@/lib/scroll/frame";

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
  scrollRootRef: RefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
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

    void import("@/lib/gsap").then(
      ({ gsap, registerGsapPlugins, ScrollTrigger }) => {
        if (cancelled) {
          return;
        }

        registerGsapPlugins();

        const tweens: ReturnType<GsapModule["gsap"]["fromTo"]>[] = [];
        const immediateElements =
          scroller.querySelectorAll<HTMLElement>(IMMEDIATE_SELECTOR);

        immediateElements.forEach((element) => {
          const delay = Number.parseFloat(element.dataset.revealDelay ?? "0");

          tweens.push(createRevealTween(gsap, element, { delay }));
        });

        cleanupImmediate = () => {
          tweens.forEach((tween) => tween.kill());
        };

        const triggers: NonNullable<
          ReturnType<GsapModule["gsap"]["fromTo"]>["scrollTrigger"]
        >[] = [];
        const elements = scroller.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);

        elements.forEach((element) => {
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
          const items =
            group.querySelectorAll<HTMLElement>(STAGGER_ITEM_SELECTOR);

          if (items.length === 0) {
            return;
          }

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
  }, [scrollRootRef]);
}

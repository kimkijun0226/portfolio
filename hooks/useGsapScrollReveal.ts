"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";

const REVEAL_SELECTOR = "[data-reveal]";
const IMMEDIATE_SELECTOR = "[data-reveal-immediate]";
const STAGGER_SELECTOR = "[data-reveal-stagger]";
const STAGGER_ITEM_SELECTOR = "[data-reveal-item]";

const REVEAL_FROM = {
  y: 56,
  opacity: 0,
  scale: 0.9,
} as const;

function createRevealTween(
  targets: gsap.TweenTarget,
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

  const tweenVars: gsap.TweenVars = {
    ...REVEAL_FROM,
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

  return gsap.from(targets, tweenVars);
}

export function useGsapScrollReveal(
  scrollRootRef: RefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    const scroller = scrollRootRef.current;

    if (!scroller) {
      return;
    }

    registerGsapPlugins();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const tweens: gsap.core.Tween[] = [];
    const immediateElements =
      scroller.querySelectorAll<HTMLElement>(IMMEDIATE_SELECTOR);

    immediateElements.forEach((element) => {
      const delay = Number.parseFloat(element.dataset.revealDelay ?? "0");

      tweens.push(
        createRevealTween(element, { delay })
      );
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [scrollRootRef]);

  useLayoutEffect(() => {
    const scroller = scrollRootRef.current;

    if (!scroller) {
      return;
    }

    registerGsapPlugins();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const elements = scroller.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);

    elements.forEach((element) => {
      const delay = Number.parseFloat(element.dataset.revealDelay ?? "0");

      const animation = createRevealTween(element, {
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
      const items = group.querySelectorAll<HTMLElement>(STAGGER_ITEM_SELECTOR);

      if (items.length === 0) {
        return;
      }

      const animation = createRevealTween(items, {
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

    const onScroll = () => {
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

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refresh);
      if (scrollTriggerRafId !== 0) {
        window.cancelAnimationFrame(scrollTriggerRafId);
      }
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [scrollRootRef]);
}

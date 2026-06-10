"use client";

import { type RefObject, useLayoutEffect } from "react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";

const REVEAL_SELECTOR = "[data-reveal]";
const IMMEDIATE_SELECTOR = "[data-reveal-immediate]";

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
        gsap.from(element, {
          y: 48,
          opacity: 0,
          scale: 0.92,
          duration: 0.9,
          delay,
          ease: "back.out(1.6)",
        })
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

      const animation = gsap.from(element, {
        y: 56,
        opacity: 0,
        scale: 0.9,
        duration: 0.9,
        delay,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: element,
          scroller,
          start: "top 86%",
          toggleActions: "play none none none",
        },
      });

      const trigger = animation.scrollTrigger;

      if (trigger) {
        triggers.push(trigger);
      }
    });

    const staggerGroups = scroller.querySelectorAll<HTMLElement>(
      "[data-reveal-stagger]"
    );

    staggerGroups.forEach((group) => {
      const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");

      if (items.length === 0) {
        return;
      }

      const animation = gsap.from(items, {
        y: 48,
        opacity: 0,
        scale: 0.92,
        duration: 0.85,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: group,
          scroller,
          start: "top 84%",
          toggleActions: "play none none none",
        },
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

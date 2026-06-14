"use client";

import { type RefObject, useEffect } from "react";
import { subscribeScrollFrame } from "@/lib/scroll/frame";
import { getSectionOffsetTop } from "@/lib/scroll/utils";

const DOT_END_PADDING = 16;
const ANCHOR_RATIO = 0.2;

type TimelineItemCache = {
  element: HTMLElement;
  topAbs: number;
  bottomAbs: number;
  topRel: number;
  height: number;
  color: string;
  company: string;
  period: string;
  periodRaw: string;
};

type TrackerState = {
  trackerY: number;
  color: string;
  metaIndex: number;
};

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));

  return t * t * (3 - 2 * t);
}

function getOffsetWithin(ancestor: HTMLElement, element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;

  while (node && node !== ancestor) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;

    if (node && !ancestor.contains(node)) {
      break;
    }
  }

  return top;
}

function getDotEndRel(height: number) {
  return Math.max(8, height - DOT_END_PADDING);
}

function mixHexColors(from: string, to: string, amount: number) {
  const parse = (hex: string) => {
    const normalized = hex.replace("#", "");

    return [
      Number.parseInt(normalized.slice(0, 2), 16),
      Number.parseInt(normalized.slice(2, 4), 16),
      Number.parseInt(normalized.slice(4, 6), 16),
    ];
  };

  try {
    const [r1, g1, b1] = parse(from);
    const [r2, g2, b2] = parse(to);
    const mix = (start: number, end: number) =>
      Math.round(start + (end - start) * amount);

    const r = mix(r1, r2);
    const g = mix(g1, g2);
    const b = mix(b1, b2);

    return `rgb(${r} ${g} ${b})`;
  } catch {
    return amount >= 0.5 ? to : from;
  }
}

function computeTrackerState(
  anchorScroll: number,
  items: TimelineItemCache[]
): TrackerState | null {
  if (items.length === 0) {
    return null;
  }

  const first = items[0];
  const last = items[items.length - 1];

  if (anchorScroll <= first.topAbs) {
    return {
      trackerY: first.topRel,
      color: first.color,
      metaIndex: 0,
    };
  }

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const next = items[index + 1];

    if (anchorScroll >= item.topAbs && anchorScroll < item.bottomAbs) {
      const progress =
        (anchorScroll - item.topAbs) / Math.max(item.bottomAbs - item.topAbs, 1);

      return {
        trackerY: item.topRel + progress * getDotEndRel(item.height),
        color: item.color,
        metaIndex: index,
      };
    }

    if (next && anchorScroll >= item.bottomAbs && anchorScroll < next.topAbs) {
      const gapProgress = smoothstep(
        (anchorScroll - item.bottomAbs) / Math.max(next.topAbs - item.bottomAbs, 1)
      );
      const fromY = item.topRel + getDotEndRel(item.height);
      const toY = next.topRel;

      return {
        trackerY: fromY + (toY - fromY) * gapProgress,
        color: mixHexColors(item.color, next.color, gapProgress),
        metaIndex: gapProgress >= 0.5 ? index + 1 : index,
      };
    }
  }

  return {
    trackerY: last.topRel + getDotEndRel(last.height),
    color: last.color,
    metaIndex: items.length - 1,
  };
}

export function useExperienceTimelineDot(
  sectionRef: RefObject<HTMLElement | null>,
  timelineRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLUListElement | null>,
  trackerRef: RefObject<HTMLElement | null>,
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    const list = listRef.current;
    const tracker = trackerRef.current;
    const content = contentRef.current;

    if (!wrapper || !section || !timeline || !list || !tracker || !content) {
      return;
    }

    const companyEl = tracker.querySelector<HTMLElement>("[data-timeline-company]");
    const periodEl = tracker.querySelector<HTMLTimeElement>("[data-timeline-period]");
    const dotCoreEl = tracker.querySelector<HTMLElement>("[data-timeline-dot-core]");

    if (!companyEl || !periodEl || !dotCoreEl) {
      return;
    }

    let sectionTop = 0;
    let sectionBottom = 0;
    let timelineTopAbs = 0;
    let itemsCache: TimelineItemCache[] = [];
    let lastMetaIndex = -1;
    let lastColor = "";
    let isInSection = false;
    let resizeTimer = 0;

    const rebuildCache = () => {
      const listNode = listRef.current;
      const timelineNode = timelineRef.current;

      if (!listNode || !timelineNode) {
        itemsCache = [];
        return;
      }

      sectionTop = getSectionOffsetTop(section, content);
      sectionBottom = sectionTop + section.offsetHeight;
      const timelineTop = getOffsetWithin(section, timelineNode);
      timelineTopAbs = sectionTop + timelineTop;

      itemsCache = Array.from(
        listNode.querySelectorAll<HTMLElement>("li[data-timeline-item]")
      ).map((item) => {
        const topRel = getOffsetWithin(timelineNode, item);
        const height = item.offsetHeight;

        return {
          element: item,
          topAbs: timelineTopAbs + topRel,
          bottomAbs: timelineTopAbs + topRel + height,
          topRel,
          height,
          color: item.dataset.color ?? "#ffffff",
          company: item.dataset.company ?? "",
          period: item.dataset.period ?? "",
          periodRaw: item.dataset.periodRaw ?? "",
        };
      });
    };

    const updateMeta = (index: number) => {
      const item = itemsCache[index];

      if (!item) {
        return;
      }

      companyEl.textContent = item.company;
      periodEl.textContent = item.period;
      periodEl.dateTime = item.periodRaw.replace(/\s*—\s*/, "/");
    };

    const setActiveItem = (index: number) => {
      itemsCache.forEach((item, itemIndex) => {
        const isActive = itemIndex === index;

        if (isActive) {
          item.element.setAttribute("data-timeline-active", "");
          item.element.style.setProperty("--item-color", item.color);
          return;
        }

        item.element.removeAttribute("data-timeline-active");
        item.element.style.removeProperty("--item-color");
      });
    };

    const update = () => {
      if (itemsCache.length === 0) {
        return;
      }

      const scrollTop = wrapper.scrollTop;
      const wrapperHeight = wrapper.clientHeight;
      const inSection =
        scrollTop + wrapperHeight >= sectionTop && scrollTop <= sectionBottom;

      if (inSection !== isInSection) {
        isInSection = inSection;
        tracker.style.willChange = inSection ? "transform" : "";
        wrapper.toggleAttribute("data-in-experience", inSection);
      }

      if (!inSection) {
        return;
      }

      const anchorScroll = scrollTop + wrapperHeight * ANCHOR_RATIO;
      const state = computeTrackerState(anchorScroll, itemsCache);

      if (!state) {
        return;
      }

      tracker.style.transform = `translate3d(0, ${state.trackerY}px, 0)`;

      if (state.color !== lastColor) {
        dotCoreEl.style.setProperty("--project-color", state.color);
        lastColor = state.color;
      }

      if (state.metaIndex !== lastMetaIndex) {
        updateMeta(state.metaIndex);
        setActiveItem(state.metaIndex);
        lastMetaIndex = state.metaIndex;
      }
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        lastMetaIndex = -1;
        lastColor = "";
        rebuildCache();
        update();
      }, 120);
    };

    rebuildCache();
    update();

    const unsubscribeScroll = subscribeScrollFrame(wrapper, update);
    window.addEventListener("resize", onResize, { passive: true });

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(section);
    resizeObserver.observe(list);

    return () => {
      window.clearTimeout(resizeTimer);
      unsubscribeScroll();
      wrapper.removeAttribute("data-in-experience");
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      tracker.style.transform = "";
      tracker.style.willChange = "";
      dotCoreEl.style.removeProperty("--project-color");

      itemsCache.forEach((item) => {
        item.element.removeAttribute("data-timeline-active");
        item.element.style.removeProperty("--item-color");
      });
    };
  }, [
    sectionRef,
    timelineRef,
    listRef,
    trackerRef,
    wrapperRef,
    contentRef,
  ]);
}

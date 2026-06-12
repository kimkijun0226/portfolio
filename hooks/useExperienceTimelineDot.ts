"use client";

import { type RefObject, useEffect } from "react";
import { subscribeScrollFrame } from "@/lib/scroll-frame";
import { getSectionOffsetTop } from "@/lib/scroll-utils";

const DOT_START_OFFSET = 0;
const DOT_END_PADDING = 16;
const ANCHOR_RATIO = 0.2;
const HANDOFF_ZONE = 96;

type TimelineItemCache = {
  itemEl: HTMLElement;
  dotEl: HTMLElement;
  metaEl: HTMLElement;
  itemTopAbs: number;
  itemBottomAbs: number;
  itemHeight: number;
  color: string;
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

function getDotEndInItem(itemHeight: number) {
  return Math.max(DOT_START_OFFSET + 8, itemHeight - DOT_END_PADDING);
}

function getDotOffsetInItem(
  itemTopAbs: number,
  itemBottomAbs: number,
  itemHeight: number,
  anchorScroll: number
) {
  const dotStart = DOT_START_OFFSET;
  const dotEnd = getDotEndInItem(itemHeight);

  if (anchorScroll <= itemTopAbs) {
    return dotStart;
  }

  if (anchorScroll >= itemBottomAbs) {
    return dotEnd;
  }

  const progress = (anchorScroll - itemTopAbs) / (itemBottomAbs - itemTopAbs);

  return dotStart + progress * (dotEnd - dotStart);
}

function computeItemStates(anchorScroll: number, items: TimelineItemCache[]) {
  const glows = new Array<number>(items.length).fill(0);
  const dotOffsets = new Array<number>(items.length).fill(DOT_START_OFFSET);

  if (items.length === 0) {
    return { glows, dotOffsets };
  }

  const first = items[0];

  if (anchorScroll < first.itemTopAbs) {
    const ramp = smoothstep((anchorScroll - (first.itemTopAbs - 120)) / 120);
    glows[0] = ramp;
    return { glows, dotOffsets };
  }

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const next = items[index + 1];

    if (anchorScroll >= item.itemTopAbs && anchorScroll < item.itemBottomAbs) {
      dotOffsets[index] = getDotOffsetInItem(
        item.itemTopAbs,
        item.itemBottomAbs,
        item.itemHeight,
        anchorScroll
      );

      if (next) {
        const handoffStart = Math.max(
          item.itemTopAbs,
          item.itemBottomAbs - HANDOFF_ZONE
        );

        if (anchorScroll >= handoffStart) {
          const progress =
            (anchorScroll - handoffStart) / (item.itemBottomAbs - handoffStart);
          const handoff = smoothstep(progress);
          glows[index] = 1 - handoff;
          glows[index + 1] = handoff;
          dotOffsets[index + 1] = DOT_START_OFFSET;
          return { glows, dotOffsets };
        }
      }

      glows[index] = 1;
      return { glows, dotOffsets };
    }

    if (
      next &&
      anchorScroll >= item.itemBottomAbs &&
      anchorScroll < next.itemTopAbs
    ) {
      const progress =
        (anchorScroll - item.itemBottomAbs) /
        (next.itemTopAbs - item.itemBottomAbs);
      const handoff = smoothstep(progress);
      glows[index] = 1 - handoff;
      glows[index + 1] = handoff;
      dotOffsets[index] = getDotEndInItem(item.itemHeight);
      dotOffsets[index + 1] = DOT_START_OFFSET;
      return { glows, dotOffsets };
    }
  }

  const last = items[items.length - 1];
  glows[items.length - 1] = 1;
  dotOffsets[items.length - 1] = getDotEndInItem(last.itemHeight);

  return { glows, dotOffsets };
}

export function useExperienceTimelineDot(
  sectionRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLUListElement | null>,
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const list = listRef.current;
    const content = contentRef.current;

    if (!wrapper || !section || !list || !content) {
      return;
    }

    let sectionTop = 0;
    let sectionBottom = 0;
    let itemsCache: TimelineItemCache[] = [];

    const rebuildCache = () => {
      const listNode = listRef.current;

      if (!listNode) {
        itemsCache = [];
        return;
      }

      sectionTop = getSectionOffsetTop(section, content);
      sectionBottom = sectionTop + section.offsetHeight;
      const listTop = getOffsetWithin(section, listNode);

      itemsCache = Array.from(
        listNode.querySelectorAll<HTMLElement>("li[data-timeline-item]")
      )
        .map((item) => {
          const dotEl = item.querySelector<HTMLElement>("[data-timeline-dot]");
          const metaEl = item.querySelector<HTMLElement>("[data-timeline-meta]");

          if (!dotEl || !metaEl) {
            return null;
          }

          const itemTopInList = item.offsetTop;
          const itemTopAbs = sectionTop + listTop + itemTopInList;
          const itemHeight = item.offsetHeight;

          return {
            itemEl: item,
            dotEl,
            metaEl,
            itemTopAbs,
            itemBottomAbs: itemTopAbs + itemHeight,
            itemHeight,
            color: item.dataset.color ?? "#ffffff",
          };
        })
        .filter((entry): entry is TimelineItemCache => entry !== null);
    };

    const update = () => {
      if (itemsCache.length === 0) {
        return;
      }

      const scrollTop = wrapper.scrollTop;
      const wrapperHeight = wrapper.clientHeight;
      const inSection =
        scrollTop + wrapperHeight >= sectionTop && scrollTop <= sectionBottom;

      if (!inSection) {
        return;
      }

      const anchorScroll = scrollTop + wrapperHeight * ANCHOR_RATIO;
      const { glows, dotOffsets } = computeItemStates(anchorScroll, itemsCache);

      itemsCache.forEach((item, index) => {
        const glow = glows[index];
        const offset = dotOffsets[index];

        item.itemEl.style.setProperty("--track-offset", `${offset}px`);
        item.itemEl.style.setProperty("--track-glow", glow.toFixed(3));
        item.dotEl.style.setProperty("--project-color", item.color);
      });
    };

    const onResize = () => {
      rebuildCache();
      update();
    };

    rebuildCache();
    update();

    const unsubscribe = subscribeScrollFrame(wrapper, update);
    window.addEventListener("resize", onResize, { passive: true });

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(section);

    return () => {
      unsubscribe();
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);

      itemsCache.forEach((item) => {
        item.itemEl.style.removeProperty("--track-offset");
        item.itemEl.style.removeProperty("--track-glow");
      });
    };
  }, [sectionRef, listRef, wrapperRef, contentRef]);
}

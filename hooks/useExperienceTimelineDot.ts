"use client";

import { type RefObject, useEffect } from "react";
import { formatPeriod } from "@/data/experience";
import { subscribeScrollFrame } from "@/lib/scroll-frame";
import { getSectionOffsetTop } from "@/lib/scroll-utils";

const DOT_START_OFFSET = 28;
const DOT_END_PADDING = 16;
const ANCHOR_RATIO = 0.5;

type TimelineItemCache = {
  itemTopAbs: number;
  itemBottomAbs: number;
  itemTopInList: number;
  itemHeight: number;
  color: string;
  company: string;
  period: string;
};

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

function getDotOffsetInItem(
  itemTop: number,
  itemBottom: number,
  itemHeight: number,
  anchorScroll: number
) {
  const dotStart = DOT_START_OFFSET;
  const dotEnd = Math.max(dotStart + 8, itemHeight - DOT_END_PADDING);
  const travel = dotEnd - dotStart;

  if (anchorScroll <= itemTop) {
    return dotStart;
  }

  if (anchorScroll >= itemBottom) {
    return dotEnd;
  }

  const progress = (anchorScroll - itemTop) / (itemBottom - itemTop);

  return dotStart + progress * travel;
}

function findActiveIndex(anchorScroll: number, items: TimelineItemCache[]) {
  let activeIndex = 0;

  for (let index = 0; index < items.length; index += 1) {
    if (anchorScroll >= items[index].itemTopAbs - 1) {
      activeIndex = index;
    }
  }

  return activeIndex;
}

export function useExperienceTimelineDot(
  sectionRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLUListElement | null>,
  dotTrackRef: RefObject<HTMLElement | null>,
  dotFaceRef: RefObject<HTMLElement | null>,
  metaCompanyRef: RefObject<HTMLParagraphElement | null>,
  metaPeriodRef: RefObject<HTMLTimeElement | null>,
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const list = listRef.current;
    const dotTrack = dotTrackRef.current;
    const dotFace = dotFaceRef.current;
    const metaCompany = metaCompanyRef.current;
    const metaPeriod = metaPeriodRef.current;
    const content = contentRef.current;

    if (
      !wrapper ||
      !section ||
      !list ||
      !dotTrack ||
      !dotFace ||
      !metaCompany ||
      !metaPeriod ||
      !content
    ) {
      return;
    }

    let sectionTop = 0;
    let sectionBottom = 0;
    let itemsCache: TimelineItemCache[] = [];
    let lastActiveIndex = -1;
    let lastColor = "";
    let lastDotY = Number.NaN;

    const rebuildCache = () => {
      const list = listRef.current;

      if (!list) {
        itemsCache = [];
        return;
      }

      sectionTop = getSectionOffsetTop(section, content);
      sectionBottom = sectionTop + section.offsetHeight;
      const listTop = getOffsetWithin(section, list);

      itemsCache = Array.from(
        list.querySelectorAll<HTMLElement>("li[data-timeline-item]")
      ).map((item) => {
        const itemTopInList = item.offsetTop;
        const itemTopAbs = sectionTop + listTop + itemTopInList;
        const itemHeight = item.offsetHeight;

        return {
          itemTopAbs,
          itemBottomAbs: itemTopAbs + itemHeight,
          itemTopInList,
          itemHeight,
          color: item.dataset.color ?? "#ffffff",
          company: item.dataset.company ?? "",
          period: item.dataset.period ?? "",
        };
      });
    };

    const syncMetaText = (item: TimelineItemCache) => {
      metaCompany.textContent = item.company;
      metaPeriod.textContent = formatPeriod(item.period);
      metaPeriod.dateTime = item.period.replace(/\s*—\s*/, "/");
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
      const activeIndex = findActiveIndex(anchorScroll, itemsCache);
      const activeItem = itemsCache[activeIndex];
      const dotInItem = getDotOffsetInItem(
        activeItem.itemTopAbs,
        activeItem.itemBottomAbs,
        activeItem.itemHeight,
        anchorScroll
      );
      const dotY = activeItem.itemTopInList + dotInItem;

      if (activeIndex !== lastActiveIndex) {
        syncMetaText(activeItem);
        lastActiveIndex = activeIndex;
      }

      if (activeItem.color !== lastColor) {
        dotFace.style.setProperty("--project-color", activeItem.color);
        lastColor = activeItem.color;
      }

      if (dotY !== lastDotY) {
        list.style.setProperty("--dot-y", `${dotY}px`);
        lastDotY = dotY;
      }
    };

    const onResize = () => {
      lastDotY = Number.NaN;
      lastActiveIndex = -1;
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
      list.style.removeProperty("--dot-y");
    };
  }, [
    sectionRef,
    listRef,
    dotTrackRef,
    dotFaceRef,
    metaCompanyRef,
    metaPeriodRef,
    wrapperRef,
    contentRef,
  ]);
}

"use client";

import { type RefObject, useEffect, useState } from "react";
import { subscribeScrollFrame } from "@/lib/scroll-frame";
import { getSectionOffsetTop, SNAP_THRESHOLD_RATIO } from "@/lib/scroll-utils";

export function useActiveSection(
  sectionIds: string[],
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>
) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content || sectionIds.length === 0) {
      return;
    }

    let sectionTops: { id: string; top: number }[] = [];

    const rebuildCache = () => {
      sectionTops = sectionIds
        .map((id) => {
          const element = document.getElementById(id);

          if (!element) {
            return null;
          }

          return {
            id,
            top: getSectionOffsetTop(element, content),
          };
        })
        .filter((entry): entry is { id: string; top: number } => entry !== null)
        .sort((a, b) => a.top - b.top);
    };

    const update = () => {
      if (sectionTops.length === 0) {
        return;
      }

      const anchor =
        wrapper.scrollTop + wrapper.clientHeight * SNAP_THRESHOLD_RATIO;
      let current = sectionTops[0].id;

      for (const section of sectionTops) {
        if (anchor >= section.top) {
          current = section.id;
        }
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    rebuildCache();
    update();

    const unsubscribe = subscribeScrollFrame(wrapper, update);
    const onResize = () => {
      rebuildCache();
      update();
    };

    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [sectionIds, wrapperRef, contentRef]);

  return activeId;
}

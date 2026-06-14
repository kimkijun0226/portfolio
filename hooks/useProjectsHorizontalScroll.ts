"use client";

import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { subscribeScrollFrame } from "@/lib/scroll/frame";
import { getScrollPaddingTop, getSectionOffsetTop } from "@/lib/scroll/utils";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useProjectsHorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  viewportRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  slideCount: number
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    if (slideCount < 1) {
      return;
    }

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;

    if (!section || !wrapper) {
      return;
    }

    const slideStep = wrapper.clientHeight;

    if (slideStep > 0) {
      section.style.height = `${slideCount * slideStep}px`;
    }

    return () => {
      section.style.height = "";
    };
  }, [sectionRef, wrapperRef, slideCount]);

  useEffect(() => {
    if (slideCount < 1) {
      return;
    }

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!section || !viewport || !track || !wrapper || !content) {
      return;
    }

    const snapMarkers = Array.from(
      section.querySelectorAll<HTMLElement>("[data-projects-snap]")
    );

    let sectionTop = 0;
    let sectionEntryTop = 0;
    let scrollHeight = 0;
    let slideStep = 0;
    let slideWidth = 0;
    let maxScrollIn = 0;
    let lastTransform = "";

    const syncSnapMarkers = () => {
      snapMarkers.forEach((marker, index) => {
        marker.style.top = `${index * slideStep}px`;
      });
    };

    const syncSectionHeight = () => {
      const viewportHeight = wrapper.clientHeight;

      if (viewportHeight > 0) {
        slideStep = viewportHeight;
        scrollHeight = slideCount * slideStep;
        maxScrollIn = Math.max(0, (slideCount - 1) * slideStep);
        section.style.height = `${scrollHeight}px`;
        syncSnapMarkers();
      }
    };

    const syncSlideWidths = () => {
      const width = viewport.clientWidth;

      if (width <= 0) {
        return;
      }

      track.style.width = `${width * slideCount}px`;
      Array.from(track.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.width = `${width}px`;
        }
      });
      slideWidth = width;
    };

    const rebuildMetrics = () => {
      const scrollPaddingTop = getScrollPaddingTop(wrapper);

      syncSectionHeight();
      sectionTop = getSectionOffsetTop(section, content);
      sectionEntryTop = sectionTop - scrollPaddingTop;
      syncSlideWidths();
    };

    const updateTrack = () => {
      const scrollTop = wrapper.scrollTop;
      const scrollPaddingTop = getScrollPaddingTop(wrapper);

      if (scrollTop < sectionEntryTop || scrollTop >= sectionTop + scrollHeight) {
        return;
      }

      const scrollIn = clamp(
        scrollTop - sectionTop + scrollPaddingTop,
        0,
        maxScrollIn
      );
      const progress = maxScrollIn <= 0 ? 0 : scrollIn / maxScrollIn;
      const transform = `translate3d(${-progress * (slideCount - 1) * slideWidth}px, 0, 0)`;

      if (transform !== lastTransform) {
        track.style.transform = transform;
        lastTransform = transform;
      }

      const index = clamp(
        Math.round(scrollIn / Math.max(slideStep, 1)),
        0,
        slideCount - 1
      );

      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    };

    rebuildMetrics();
    updateTrack();

    let resizeTimer = 0;

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        rebuildMetrics();
        lastTransform = "";
        updateTrack();
      }, 150);
    };

    const unsubscribe = subscribeScrollFrame(wrapper, updateTrack);
    window.addEventListener("resize", onResize);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(viewport);
    resizeObserver.observe(wrapper);

    return () => {
      window.clearTimeout(resizeTimer);
      unsubscribe();
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      section.style.height = "";
      track.style.transform = "";
      track.style.width = "";
      Array.from(track.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.width = "";
        }
      });
      snapMarkers.forEach((marker) => {
        marker.style.top = "0px";
      });
    };
  }, [
    sectionRef,
    viewportRef,
    trackRef,
    wrapperRef,
    contentRef,
    slideCount,
  ]);

  return { activeIndex };
}

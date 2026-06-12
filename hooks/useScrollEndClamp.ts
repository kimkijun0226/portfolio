"use client";

import { type RefObject, useEffect } from "react";

function syncViewportHeights(wrapper: HTMLElement) {
  const viewportHeight = wrapper.clientHeight;

  if (viewportHeight <= 0) {
    return;
  }

  const projectsSticky = document.querySelector<HTMLElement>(
    "[data-projects-sticky]"
  );

  if (projectsSticky) {
    projectsSticky.style.height = `${viewportHeight}px`;
  }
}

function getMaxScrollTop(wrapper: HTMLElement) {
  return Math.max(0, wrapper.scrollHeight - wrapper.clientHeight);
}

export function useScrollEndClamp(
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) {
      return;
    }

    let rafId = 0;

    const clamp = () => {
      rafId = 0;
      syncViewportHeights(wrapper);

      const maxScrollTop = getMaxScrollTop(wrapper);

      if (wrapper.scrollTop > maxScrollTop) {
        wrapper.scrollTop = maxScrollTop;
      }
    };

    const scheduleClamp = () => {
      if (rafId !== 0) {
        return;
      }

      rafId = window.requestAnimationFrame(clamp);
    };

    const resizeObserver = new ResizeObserver(scheduleClamp);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(content);

    const projects = document.getElementById("projects");

    if (projects) {
      resizeObserver.observe(projects);
    }

    window.addEventListener("resize", scheduleClamp);
    scheduleClamp();

    return () => {
      window.removeEventListener("resize", scheduleClamp);
      resizeObserver.disconnect();

      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }

      const projectsSticky = document.querySelector<HTMLElement>(
        "[data-projects-sticky]"
      );

      if (projectsSticky) {
        projectsSticky.style.height = "";
      }
    };
  }, [wrapperRef, contentRef]);
}

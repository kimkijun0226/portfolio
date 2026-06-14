type ScrollFrameListener = () => void;

const listeners = new Set<ScrollFrameListener>();
let rafId = 0;
let attachedWrapper: HTMLElement | null = null;
let scrollIdleTimer = 0;
let isScrolling = false;

export function getScrollFrameIsScrolling() {
  return isScrolling;
}

function setScrollingState(scrolling: boolean) {
  if (!attachedWrapper) {
    return;
  }

  isScrolling = scrolling;

  if (scrolling) {
    attachedWrapper.setAttribute("data-scrolling", "");
    return;
  }

  attachedWrapper.removeAttribute("data-scrolling");
}

function flush() {
  rafId = 0;
  listeners.forEach((listener) => listener());
}

function onScroll() {
  setScrollingState(true);
  window.clearTimeout(scrollIdleTimer);
  scrollIdleTimer = window.setTimeout(() => {
    setScrollingState(false);
  }, 140);

  if (rafId !== 0) {
    return;
  }

  rafId = window.requestAnimationFrame(flush);
}

function attach(wrapper: HTMLElement) {
  if (attachedWrapper === wrapper) {
    return;
  }

  attachedWrapper?.removeEventListener("scroll", onScroll);
  attachedWrapper = wrapper;
  wrapper.addEventListener("scroll", onScroll, { passive: true });
}

function detach(wrapper: HTMLElement) {
  if (attachedWrapper !== wrapper) {
    return;
  }

  wrapper.removeEventListener("scroll", onScroll);
  attachedWrapper = null;
  window.cancelAnimationFrame(rafId);
  rafId = 0;
  window.clearTimeout(scrollIdleTimer);
  isScrolling = false;
  setScrollingState(false);
}

export function subscribeScrollFrame(
  wrapper: HTMLElement,
  listener: ScrollFrameListener
) {
  attach(wrapper);
  listeners.add(listener);

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && attachedWrapper) {
      detach(attachedWrapper);
    }
  };
}

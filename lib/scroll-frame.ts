type ScrollFrameListener = () => void;

const listeners = new Set<ScrollFrameListener>();
let rafId = 0;
let attachedWrapper: HTMLElement | null = null;
let paused = false;
let scrollIdleTimer = 0;

function setScrollingState(scrolling: boolean) {
  if (!attachedWrapper) {
    return;
  }

  if (scrolling) {
    attachedWrapper.setAttribute("data-scrolling", "");
    return;
  }

  attachedWrapper.removeAttribute("data-scrolling");
}

function flush() {
  rafId = 0;

  if (paused) {
    return;
  }

  listeners.forEach((listener) => listener());
}

function onScroll() {
  if (paused) {
    return;
  }

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

export function setScrollFramePaused(value: boolean) {
  paused = value;

  if (value) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
    setScrollingState(false);
    return;
  }

  flush();
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

import Lenis from "lenis";
import { flushScrollFrame } from "./frame";

type MotionKind = "input" | "snap" | "navigation" | "chapter" | "entry";

const INPUT_IDLE_MS = 180;
const INTERACTIVE = 'a, button, input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"], [data-no-drag]';

export function attachScrollController(wrapper: HTMLElement) {
  let motion: MotionKind | null = null;
  let frameId = 0;
  let animationTime = 0;
  let lastFrameTime: number | null = null;
  let idleTimer = 0;
  let wheelGesture: { to: number; direction: number } | null = null;
  let wheelPreview: { from: number; to: number; direction: number; progress: number } | null = null;
  let lastScroll = wrapper.scrollTop;
  let touching = false;
  let pointerId: number | null = null;
  let dragging = false;
  let nativeScrollbar = false;
  let suppressClick = false;
  let axis: "x" | "y" | null = null;
  let startX = 0;
  let startY = 0;
  let startScroll = 0;
  let dragProjects: HTMLElement | null = null;

  const padding = () => Number.parseFloat(getComputedStyle(wrapper).scrollPaddingTop) || 0;
  const clamp = (top: number) => Math.max(0, Math.min(wrapper.scrollHeight - wrapper.clientHeight, top));
  const write = (top: number) => {
    smooth.scrollTo(clamp(top), { immediate: true });
    lastScroll = wrapper.scrollTop;
  };
  let cachedTargets: number[] | null = null;
  const geometry = () => {
    if (cachedTargets) return cachedTargets;
    const rootTop = wrapper.getBoundingClientRect().top;
    const offset = wrapper.scrollTop - rootTop;
    const markers = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-projects-snap]"));
    const scrollPadding = padding();
    const targets = markers.map(marker => clamp(offset + marker.getBoundingClientRect().top - scrollPadding));
    cachedTargets = targets;
    return targets;
  };
  const nearest = (targets: number[], top: number) => targets.reduce(
    (best, value) => Math.abs(value - top) < Math.abs(best - top) ? value : best, targets[0]);
  const cancel = () => {
    window.cancelAnimationFrame(frameId);
    window.clearTimeout(idleTimer);
    frameId = 0;
    lastFrameTime = null;
    idleTimer = 0;
    motion = null;
    smooth.scrollTo(wrapper.scrollTop, { immediate: true });
  };
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frame = (time: number) => {
    frameId = 0;
    animationTime += lastFrameTime === null ? 16 : Math.min(48, Math.max(0, time - lastFrameTime));
    lastFrameTime = time;
    smooth.raf(animationTime);
    if (smooth.isScrolling === "smooth") frameId = window.requestAnimationFrame(frame);
    else lastFrameTime = null;
  };
  const animateTo = (top: number, kind: MotionKind = "snap") => {
    window.clearTimeout(idleTimer);
    idleTimer = 0;
    motion = kind;
    smooth.scrollTo(clamp(top), {
      programmatic: false,
      immediate: reducedMotion(),
      lerp: kind === "input" ? 0.16 : 0.14,
      onComplete: () => {
        motion = null;
        if (!reducedMotion()) wheelGesture = null;
      },
    });
    if (!frameId && smooth.isScrolling === "smooth") {
      lastFrameTime = null;
      frameId = window.requestAnimationFrame(frame);
    }
  };
  const settle = () => {
    idleTimer = 0;
    wheelGesture = null;
    if (wheelPreview) {
      const from = wheelPreview.from;
      wheelPreview = null;
      animateTo(from);
      return;
    }
    const targets = geometry();
    const top = wrapper.scrollTop;
    // Only align inside the horizontal timeline. Entry and exit remain free scrolling.
    if (!targets.length || top < targets[0] - 1 || top > targets.at(-1)! + 1) return;
    animateTo(nearest(targets, top));
  };
  const scheduleSettle = (delay = INPUT_IDLE_MS) => {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (!touching && pointerId === null) settle();
    }, delay);
  };
  const onScroll = () => {
    if (wheelGesture) {
      // Some browsers deliver non-cancelable momentum events after the first wheel event.
      if (wrapper.scrollTop !== lastScroll) wrapper.scrollTop = lastScroll;
      return;
    }
    if (wrapper.scrollTop !== lastScroll && !motion && !touching && pointerId === null) scheduleSettle();
    lastScroll = wrapper.scrollTop;
  };
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [role="dialog"], [data-no-drag]')) return;
    const raw = Math.abs(event.deltaY) >= Math.abs(event.deltaX || 0) ? event.deltaY : event.deltaX;
    if (!raw) return;
    const direction = Math.sign(raw);
    if (!motion) lastScroll = wrapper.scrollTop;
    // A fixed release also covers reduced motion, which completes without a frame.
    const releaseGesture = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        idleTimer = 0;
        if (!motion) wheelGesture = null;
      }, INPUT_IDLE_MS);
    };
    if (wheelGesture && wheelGesture.direction === direction) {
      if (event.cancelable) event.preventDefault();
      return;
    }
    const targets = geometry();
    const top = motion === "input" ? smooth.targetScroll : wrapper.scrollTop;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? wrapper.clientHeight : 1;
    const delta = raw * unit;
    wheelGesture = null;
    if (motion && motion !== "input") cancel();
    window.clearTimeout(idleTimer);
    if (event.cancelable && targets.length && top >= targets[0] - 1 && top <= targets.at(-1)! + 1) {
      if (wheelPreview && wheelPreview.direction !== direction) {
        event.preventDefault();
        const remaining = Math.max(0, wheelPreview.progress + delta * wheelPreview.direction);
        wheelPreview.progress = remaining;
        animateTo(wheelPreview.from + wheelPreview.direction * remaining, "input");
        if (!remaining) wheelPreview = null;
        scheduleSettle();
        return;
      }
      const destination = direction > 0
        ? targets.find(target => target > top + 1)
        : targets.findLast(target => target < top - 1);
      if (destination !== undefined) {
        event.preventDefault();
        if (!wheelPreview) {
          const from = direction > 0
            ? targets.findLast(target => target <= top + 1) ?? top
            : targets.find(target => target >= top - 1) ?? top;
          wheelPreview = { from, to: destination, direction, progress: Math.abs(top - from) };
        }
        const progress = wheelPreview.progress + Math.abs(delta);
        wheelPreview.progress = progress;
        const distance = Math.abs(wheelPreview.to - wheelPreview.from);
        if (progress >= distance * 0.4) {
          wheelGesture = { to: wheelPreview.to, direction };
          wheelPreview = null;
          animateTo(wheelGesture.to, "chapter");
          releaseGesture();
        } else {
          animateTo(wheelPreview.from + direction * progress, "input");
          scheduleSettle();
        }
        return;
      }
    }
    wheelPreview = null;
    if (event.cancelable) {
      const requested = clamp(top + delta);
      const entry = targets.length ? (
        top < targets[0] - 1 && requested >= targets[0] ? targets[0]
        : top > targets.at(-1)! + 1 && requested <= targets.at(-1)! ? targets.at(-1)
        : undefined
      ) : undefined;
      event.preventDefault();
      if (entry !== undefined) {
        wheelGesture = { to: entry, direction };
        animateTo(entry, "entry");
        releaseGesture();
      } else {
        animateTo(requested, "input");
        scheduleSettle();
      }
    } else scheduleSettle();
  };
  const finish = () => {
    wheelPreview = null;
    wheelGesture = null;
    const captured = pointerId;
    pointerId = null;
    if (captured !== null && wrapper.hasPointerCapture(captured)) wrapper.releasePointerCapture(captured);
    if (dragging) {
      dragging = false;
      wrapper.removeAttribute("data-drag-scrolling");
      settle();
    } else if (captured !== null) scheduleSettle();
    nativeScrollbar = false;
    dragProjects = null;
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !(event.target instanceof Element)) return;
    wheelPreview = null;
    wheelGesture = null;
    suppressClick = false;
    if (event.target.closest(INTERACTIVE)) return;
    cancel();
    pointerId = event.pointerId;
    nativeScrollbar = event.clientX - wrapper.getBoundingClientRect().left >= wrapper.clientWidth;
    if (nativeScrollbar) return;
    startX = event.clientX;
    startY = event.clientY;
    startScroll = wrapper.scrollTop;
    axis = null;
    dragProjects = event.target.closest<HTMLElement>("#projects");
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId || nativeScrollbar) return;
    if (!(event.buttons & 1)) { finish(); return; }
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!dragging) {
      if (Math.hypot(dx, dy) < 6) return;
      axis = dragProjects && Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      dragging = true;
      suppressClick = true;
      wrapper.setAttribute("data-drag-scrolling", "");
      wrapper.setPointerCapture(event.pointerId);
      window.getSelection()?.removeAllRanges();
    }
    event.preventDefault();
    let to = startScroll - dy;
    if (axis === "x") {
      const targets = geometry();
      const before = targets[0] ?? startScroll;
      const after = targets.at(-1) ?? startScroll;
      to = Math.max(before, Math.min(after, startScroll - dx * wrapper.clientHeight / Math.max(1, wrapper.clientWidth)));
    }
    write(to);
  };
  const onPointerEnd = (event: PointerEvent) => { if (event.pointerId === pointerId) finish(); };
  const onClick = (event: MouseEvent) => {
    if (suppressClick && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  };
  const onDragStart = (event: DragEvent) => { if (pointerId !== null) event.preventDefault(); };
  const onTouchStart = () => {
    wheelPreview = null;
    wheelGesture = null;
    cancel();
    touching = true;
  };
  const onTouchEnd = () => { touching = false; scheduleSettle(); };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
    if (event.target instanceof Element && event.target.closest(INTERACTIVE)) return;
    wheelPreview = null;
    wheelGesture = null;
    cancel();
  };
  const onResize = () => { cachedTargets = null; wheelPreview = null; wheelGesture = null; cancel(); scheduleSettle(200); };

  const smooth = new Lenis({
    wrapper,
    content: wrapper.firstElementChild as HTMLElement ?? wrapper,
    autoRaf: false,
    syncTouch: false,
    // Wheel policy is handled above; Lenis alone owns position interpolation.
    virtualScroll: ({ event }) => event.type !== "wheel",
  });
  smooth.on("scroll", () => {
    if (!motion && wrapper.scrollTop !== lastScroll && !touching && pointerId === null) scheduleSettle();
    lastScroll = wrapper.scrollTop;
    flushScrollFrame(wrapper);
  });
  const resizeObserver = new ResizeObserver(() => { cachedTargets = null; });
  resizeObserver.observe(wrapper);
  if (wrapper.firstElementChild) resizeObserver.observe(wrapper.firstElementChild);

  wrapper.addEventListener("scroll", onScroll, { passive: true });
  wrapper.addEventListener("wheel", onWheel, { passive: false });
  wrapper.addEventListener("pointerdown", onPointerDown);
  wrapper.addEventListener("pointermove", onPointerMove);
  wrapper.addEventListener("pointerup", onPointerEnd);
  wrapper.addEventListener("pointercancel", onPointerEnd);
  wrapper.addEventListener("lostpointercapture", onPointerEnd);
  wrapper.addEventListener("click", onClick, true);
  wrapper.addEventListener("dragstart", onDragStart);
  wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
  wrapper.addEventListener("touchend", onTouchEnd, { passive: true });
  wrapper.addEventListener("touchcancel", onTouchEnd, { passive: true });
  window.addEventListener("pointerup", onPointerEnd);
  window.addEventListener("pointercancel", onPointerEnd);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);
  window.addEventListener("blur", finish);

  return {
    scrollTo: (top: number) => { wheelPreview = null; wheelGesture = null; animateTo(top, "navigation"); },
    destroy() {
      cancel();
      resizeObserver.disconnect();
      smooth.destroy();
      const captured = pointerId;
      pointerId = null;
      if (captured !== null && wrapper.hasPointerCapture(captured)) wrapper.releasePointerCapture(captured);
      wrapper.removeAttribute("data-drag-scrolling");
      wrapper.removeEventListener("scroll", onScroll);
      wrapper.removeEventListener("wheel", onWheel);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      wrapper.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerup", onPointerEnd);
      wrapper.removeEventListener("pointercancel", onPointerEnd);
      wrapper.removeEventListener("lostpointercapture", onPointerEnd);
      wrapper.removeEventListener("click", onClick, true);
      wrapper.removeEventListener("dragstart", onDragStart);
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchend", onTouchEnd);
      wrapper.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", finish);
    },
  };
}

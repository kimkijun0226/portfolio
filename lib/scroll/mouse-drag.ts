export function attachMouseDrag(wrapper: HTMLElement) {
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let startScroll = 0;
  let axis: "x" | "y" | null = null;
  let projects: HTMLElement | null = null;
  let dragging = false;
  let suppressClick = false;
  let rafId = 0;

  let idleTimer = 0;
  let touching = false;
  let lastScroll = wrapper.scrollTop;
  let direction = 0;
  let wheelTarget: number | null = null;
  let wheelDirection = 0;
  let wheelDistance = 0;
  let wheelSettling = false;
  let wheelIdleTimer = 0;

  const resetWheelGesture = () => {
    window.clearTimeout(wheelIdleTimer);
    wheelDistance = 0;
    wheelSettling = false;
    wheelDirection = 0;
  };

  const waitForWheelIdle = () => {
    window.clearTimeout(wheelIdleTimer);
    wheelIdleTimer = window.setTimeout(resetWheelGesture, 180);
  };

  const getProjectTargets = (scope = wrapper) => {
    const padding = Number.parseFloat(getComputedStyle(wrapper).scrollPaddingTop) || 0;
    const origin = wrapper.getBoundingClientRect().top;
    const max = Math.max(0, wrapper.scrollHeight - wrapper.clientHeight);
    return Array.from(scope.querySelectorAll<HTMLElement>("[data-projects-snap]"))
      .map((marker) => Math.max(0, Math.min(max,
        wrapper.scrollTop + marker.getBoundingClientRect().top - origin - padding)))
      .sort((a, b) => a - b);
  };

  const stopAnimation = () => {
    window.cancelAnimationFrame(rafId);
    window.clearTimeout(idleTimer);
    rafId = 0;
    idleTimer = 0;
    wheelTarget = null;
  };

  const scrollTo = (position: number) => {
    stopAnimation();
    const start = wrapper.scrollTop;
    const max = Math.max(0, wrapper.scrollHeight - wrapper.clientHeight);
    const target = Math.max(0, Math.min(max, position));
    const distance = Math.abs(target - start);
    if (distance < 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrapper.scrollTop = target;
      lastScroll = target;
      return;
    }

    const duration = Math.min(900, 500 + distance * 0.18);
    let started: number | null = null;
    const animate = (time: number) => {
      started ??= time;
      const progress = Math.min(1, (time - started) / duration);
      // Quintic easing has zero velocity and acceleration at both ends.
      const eased = progress ** 3 * (10 - 15 * progress + 6 * progress ** 2);
      wrapper.scrollTop = start + (target - start) * eased;
      lastScroll = wrapper.scrollTop;
      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        rafId = 0;
        direction = 0;
        wheelTarget = null;
      }
    };
    rafId = window.requestAnimationFrame(animate);
  };

  const settle = (horizontalOnly = false) => {
    idleTimer = 0;
    const start = wrapper.scrollTop;
    const targets = getProjectTargets(horizontalOnly && projects ? projects : wrapper);
    if (targets.length === 0) return;

    if (!horizontalOnly) {
      const first = targets[0];
      const last = targets[targets.length - 1];
      const approachingEntry = direction > 0 && start < first
        && first - start <= wrapper.clientHeight * 0.35;
      // Only the horizontal timeline and its entry attract scrolling.
      if (!approachingEntry && (start < first - 1 || start > last + 1)) return;
    }
    // A modest directional bias avoids pulling a deliberate gesture backwards.
    const projected = horizontalOnly ? start : start + direction * wrapper.clientHeight * 0.28;
    const target = targets.reduce((best, value) =>
      Math.abs(value - projected) < Math.abs(best - projected) ? value : best);
    scrollTo(target);
  };

  const scheduleSettle = () => {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (pointerId === null && !touching && rafId === 0) settle();
    }, 180);
  };

  const onScroll = () => {
    const current = wrapper.scrollTop;
    if (rafId === 0 && current !== lastScroll) {
      direction = Math.sign(current - lastScroll);
      if (pointerId === null && !touching) scheduleSettle();
    }
    lastScroll = current;
  };

  const finish = () => {
    const capturedId = pointerId;
    pointerId = null;
    if (capturedId !== null && wrapper.hasPointerCapture(capturedId)) {
      wrapper.releasePointerCapture(capturedId);
    }
    if (dragging) {
      dragging = false;
      wrapper.removeAttribute("data-drag-scrolling");
      settle(axis === "x");
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !(event.target instanceof Element)) {
      return;
    }
    stopAnimation();
    resetWheelGesture();
    direction = 0;
    suppressClick = false;
    if (event.target.closest('a, button, input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"], [data-no-drag]')) {
      return;
    }
    // Leave the native scrollbar thumb under the browser's control.
    const rect = wrapper.getBoundingClientRect();
    if (event.clientX - rect.left >= wrapper.clientWidth) {
      return;
    }
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startScroll = wrapper.scrollTop;
    axis = null;
    projects = event.target.closest<HTMLElement>("#projects");
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) {
      return;
    }
    if ((event.buttons & 1) === 0) {
      finish();
      return;
    }
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!dragging) {
      if (Math.hypot(dx, dy) < 6) {
        return;
      }
      axis = projects && Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      dragging = true;
      suppressClick = true;
      wrapper.setAttribute("data-drag-scrolling", "");
      wrapper.setPointerCapture(event.pointerId);
      window.getSelection()?.removeAllRanges();
    }
    event.preventDefault();
    let target = startScroll - dy;
    if (axis === "x" && projects) {
      const padding = Number.parseFloat(getComputedStyle(wrapper).scrollPaddingTop) || 0;
      const sectionTop = projects.getBoundingClientRect().top - wrapper.getBoundingClientRect().top + wrapper.scrollTop - padding;
      const lastSlide = sectionTop + projects.offsetHeight - wrapper.clientHeight;
      target = Math.max(sectionTop, Math.min(lastSlide,
        startScroll - dx * wrapper.clientHeight / Math.max(wrapper.clientWidth, 1)));
    }
    wrapper.scrollTop = Math.max(0, Math.min(wrapper.scrollHeight - wrapper.clientHeight, target));
  };

  const onPointerEnd = (event: PointerEvent) => {
    if (event.pointerId === pointerId) {
      finish();
    }
  };
  const onClick = (event: MouseEvent) => {
    if (suppressClick && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  };
  const onDragStart = (event: DragEvent) => {
    if (pointerId !== null) event.preventDefault();
  };
  const onInterrupt = () => {
    resetWheelGesture();
    finish();
    stopAnimation();
    scheduleSettle();
  };
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || !event.cancelable) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [role="dialog"], [data-no-drag]')) return;

    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX || 0)
      ? event.deltaY : event.deltaX;
    if (!delta) {
      onInterrupt();
      return;
    }
    const nextDirection = Math.sign(delta);

    // Consume the momentum tail as part of the same chapter transition.
    if (nextDirection === wheelDirection && (wheelSettling || (rafId !== 0 && wheelTarget !== null))) {
      event.preventDefault();
      waitForWheelIdle();
      return;
    }

    const targets = getProjectTargets();
    const current = wrapper.scrollTop;
    const first = targets[0];
    const last = targets[targets.length - 1];
    let target: number | undefined;
    if (current < first - 1) {
      if (nextDirection > 0 && first - current <= wrapper.clientHeight * 0.35) target = first;
    } else if (current > last + 1) {
      if (nextDirection < 0 && current - last <= wrapper.clientHeight * 0.35) target = last;
    } else {
      target = nextDirection > 0
        ? targets.find(value => value > current + 1)
        : targets.findLast(value => value < current - 1);
    }

    if (target === undefined) {
      onInterrupt();
      direction = nextDirection;
      return;
    }

    event.preventDefault();
    if (nextDirection !== wheelDirection) wheelDistance = 0;
    wheelDirection = nextDirection;
    direction = nextDirection;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? wrapper.clientHeight : 1;
    wheelDistance += Math.abs(delta) * unit;
    waitForWheelIdle();
    if (wheelDistance < 24) return;

    wheelSettling = true;
    scrollTo(target);
    wheelTarget = target;
  };
  const onTouchStart = () => {
    onInterrupt();
    touching = true;
  };
  const onTouchEnd = () => {
    touching = false;
    scheduleSettle();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [role="dialog"]')) return;
    onInterrupt();
  };

  wrapper.addEventListener("scroll", onScroll, { passive: true });
  wrapper.addEventListener("pointerdown", onPointerDown);
  wrapper.addEventListener("pointermove", onPointerMove);
  wrapper.addEventListener("pointerup", onPointerEnd);
  wrapper.addEventListener("pointercancel", onPointerEnd);
  wrapper.addEventListener("lostpointercapture", onPointerEnd);
  wrapper.addEventListener("click", onClick, true);
  wrapper.addEventListener("dragstart", onDragStart);
  wrapper.addEventListener("wheel", onWheel, { passive: false });
  wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
  wrapper.addEventListener("touchend", onTouchEnd, { passive: true });
  wrapper.addEventListener("touchcancel", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("blur", finish);

  const destroy = () => {
    resetWheelGesture();
    const capturedId = pointerId;
    pointerId = null;
    if (capturedId !== null && wrapper.hasPointerCapture(capturedId)) {
      wrapper.releasePointerCapture(capturedId);
    }
    stopAnimation();
    wrapper.removeAttribute("data-drag-scrolling");
    wrapper.removeEventListener("scroll", onScroll);
    wrapper.removeEventListener("pointerdown", onPointerDown);
    wrapper.removeEventListener("pointermove", onPointerMove);
    wrapper.removeEventListener("pointerup", onPointerEnd);
    wrapper.removeEventListener("pointercancel", onPointerEnd);
    wrapper.removeEventListener("lostpointercapture", onPointerEnd);
    wrapper.removeEventListener("click", onClick, true);
    wrapper.removeEventListener("dragstart", onDragStart);
    wrapper.removeEventListener("wheel", onWheel);
    wrapper.removeEventListener("touchstart", onTouchStart);
    wrapper.removeEventListener("touchend", onTouchEnd);
    wrapper.removeEventListener("touchcancel", onTouchEnd);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("blur", finish);
  };

  return { destroy, scrollTo };
}

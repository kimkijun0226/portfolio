export const SNAP_THRESHOLD_RATIO = 0.35;
export const TALL_SECTION_IDS = new Set(["experience"]);
export const TALL_SECTION_BOUNDARY_RATIO = 0.2;

export function getScrollPaddingTop(scroller: HTMLElement) {
  const parsed = Number.parseFloat(getComputedStyle(scroller).scrollPaddingTop);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function getSectionScrollTarget(
  sectionId: string,
  element: HTMLElement,
  content: HTMLElement,
  wrapper: HTMLElement
) {
  const top = getSectionOffsetTop(element, content);

  if (sectionId === "contact") {
    return top + element.offsetHeight - wrapper.clientHeight;
  }

  return top;
}

export function getSectionOffsetTop(
  element: HTMLElement,
  content: HTMLElement
) {
  if (element.parentElement === content) {
    return element.offsetTop;
  }

  let top = 0;
  let node: HTMLElement | null = element;

  while (node && node !== content) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return top;
}

export function buildSnapPoints(
  sectionIds: string[],
  content: HTMLElement,
  viewportHeight: number,
  projectsSlideCount: number
) {
  const points: number[] = [];

  for (const id of sectionIds) {
    const element = document.getElementById(id);

    if (!element) {
      continue;
    }

    const top = getSectionOffsetTop(element, content);

    if (id === "projects" && projectsSlideCount > 1) {
      const slideStep = getProjectsSlideStep(
        element.offsetHeight,
        viewportHeight,
        projectsSlideCount
      );

      for (let index = 0; index < projectsSlideCount; index += 1) {
        points.push(top + index * slideStep);
      }
      continue;
    }

    points.push(top);

    if (TALL_SECTION_IDS.has(id)) {
      const bottomAlign = top + element.offsetHeight - viewportHeight;

      if (bottomAlign > top + viewportHeight * 0.5) {
        points.push(bottomAlign);
      }
    }
  }

  return [...new Set(points.map((point) => Math.round(point * 10) / 10))].sort(
    (a, b) => a - b
  );
}

type SnapSegment = {
  lower: number;
  upper: number;
};

export function findSnapSegment(
  scroll: number,
  points: number[]
): SnapSegment | null {
  if (points.length === 0) {
    return null;
  }

  if (points.length === 1) {
    return { lower: points[0], upper: points[0] };
  }

  if (scroll <= points[0]) {
    return { lower: points[0], upper: points[1] };
  }

  const last = points[points.length - 1];

  if (scroll >= last) {
    return { lower: points[points.length - 2], upper: last };
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    const lower = points[index];
    const upper = points[index + 1];

    if (scroll >= lower && scroll < upper) {
      return { lower, upper };
    }
  }

  return { lower: last, upper: last };
}

export function isInsideTallSectionFreeZone(
  scroll: number,
  sectionIds: string[],
  content: HTMLElement,
  viewportHeight: number
) {
  const boundary = viewportHeight * TALL_SECTION_BOUNDARY_RATIO;

  for (const id of sectionIds) {
    if (!TALL_SECTION_IDS.has(id)) {
      continue;
    }

    const element = document.getElementById(id);

    if (!element) {
      continue;
    }

    const top = getSectionOffsetTop(element, content);
    const bottom = top + element.offsetHeight - viewportHeight;

    if (scroll > top + boundary && scroll < bottom - boundary) {
      return true;
    }
  }

  return false;
}

export type ProjectsBounds = {
  top: number;
  end: number;
  slideStep: number;
  slideCount: number;
};

export function getProjectsSlideStep(
  sectionHeight: number,
  viewportHeight: number,
  slideCount: number
) {
  if (slideCount <= 1) {
    return viewportHeight;
  }

  const travel = Math.max(viewportHeight, sectionHeight - viewportHeight);

  return travel / (slideCount - 1);
}

export function getProjectsBounds(
  content: HTMLElement,
  viewportHeight: number,
  slideCount: number
): ProjectsBounds | null {
  const element = document.getElementById("projects");

  if (!element || slideCount < 2) {
    return null;
  }

  const top = getSectionOffsetTop(element, content);
  const sectionHeight = element.offsetHeight;

  return {
    top,
    end: top + sectionHeight,
    slideStep: getProjectsSlideStep(sectionHeight, viewportHeight, slideCount),
    slideCount,
  };
}

export function getProjectsSlidePoints(bounds: ProjectsBounds) {
  return Array.from(
    { length: bounds.slideCount },
    (_, index) => bounds.top + index * bounds.slideStep
  );
}

export function resolveSnapTargetForScroll(
  scroll: number,
  points: number[],
  wheelDirection: 1 | -1,
  bounds: ProjectsBounds | null
) {
  if (!bounds || scroll < bounds.top || scroll >= bounds.end) {
    return resolveSnapTarget(scroll, points, wheelDirection);
  }

  const slidePoints = getProjectsSlidePoints(bounds);

  return resolveSnapTarget(scroll, slidePoints, wheelDirection);
}

export function findClosestPointIndex(scroll: number, points: number[]) {
  if (points.length === 0) {
    return 0;
  }

  let closestIndex = 0;
  let minDistance = Math.abs(scroll - points[0]);

  for (let index = 1; index < points.length; index += 1) {
    const distance = Math.abs(scroll - points[index]);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

export function getGestureSnapLimit(
  gestureStart: number,
  points: number[],
  wheelDirection: 1 | -1
) {
  if (points.length === 0) {
    return gestureStart;
  }

  const startIndex = findClosestPointIndex(gestureStart, points);

  if (wheelDirection > 0) {
    return points[Math.min(startIndex + 1, points.length - 1)];
  }

  return points[Math.max(startIndex - 1, 0)];
}

export function clampSnapTargetToAdjacent(
  gestureStartScroll: number,
  target: number,
  points: number[],
  wheelDirection: 1 | -1
) {
  if (points.length === 0) {
    return target;
  }

  const startIndex = findClosestPointIndex(gestureStartScroll, points);
  let targetIndex = findClosestPointIndex(target, points);

  if (wheelDirection > 0) {
    targetIndex = Math.min(targetIndex, startIndex + 1);
  } else {
    targetIndex = Math.max(targetIndex, startIndex - 1);
  }

  return points[targetIndex];
}

export function resolveSnapTarget(
  scroll: number,
  points: number[],
  wheelDirection: 1 | -1,
  thresholdRatio = SNAP_THRESHOLD_RATIO
) {
  const segment = findSnapSegment(scroll, points);

  if (!segment) {
    return scroll;
  }

  const { lower, upper } = segment;

  if (lower === upper) {
    return lower;
  }

  const progress = (scroll - lower) / (upper - lower);

  if (wheelDirection > 0) {
    return progress >= thresholdRatio ? upper : lower;
  }

  return progress <= 1 - thresholdRatio ? lower : upper;
}

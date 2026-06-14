export const SNAP_THRESHOLD_RATIO = 0.35;

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

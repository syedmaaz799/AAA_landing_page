export function getAnchorScrollTarget(
  element: HTMLElement,
  scrollTop = window.scrollY,
): number {
  const scrollMarginTop = parseFloat(getComputedStyle(element).scrollMarginTop)
  const offset =
    Number.isFinite(scrollMarginTop) && scrollMarginTop > 0
      ? scrollMarginTop
      : (document.querySelector("header")?.getBoundingClientRect().height ?? 88)

  return element.getBoundingClientRect().top + scrollTop - offset
}

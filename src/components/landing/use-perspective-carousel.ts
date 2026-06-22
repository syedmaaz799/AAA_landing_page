"use client"

import { useCallback, useEffect, useRef, type RefObject } from "react"

type CarouselBreakpoint = {
  mq: string
  gap?: number
  peek?: number
  rotateY?: number
  zDepth?: number
  scaleDrop?: number
  blurMax?: number
  activeLeftBias?: number
  maxSlideWidth?: number
}

export type PerspectiveCarouselOptions = {
  gap?: number
  peek?: number
  rotateY?: number
  zDepth?: number
  scaleDrop?: number
  blurMax?: number
  activeLeftBias?: number
  maxSlideWidth?: number
  breakpoints?: CarouselBreakpoint[]
}

type CarouselState = {
  index: number
  pos: number
  width: number
  gap: number
}

const DEFAULT_OPTS: Required<
  Omit<PerspectiveCarouselOptions, "breakpoints">
> & { breakpoints: CarouselBreakpoint[] } = {
  gap: 24,
  peek: 0.12,
  rotateY: 28,
  zDepth: 120,
  scaleDrop: 0.08,
  blurMax: 1.6,
  activeLeftBias: 0.1,
  maxSlideWidth: 380,
  breakpoints: [
    {
      mq: "(max-width: 1024px)",
      gap: 20,
      peek: 0.1,
      rotateY: 24,
      zDepth: 100,
      scaleDrop: 0.07,
      maxSlideWidth: 340,
    },
    {
      mq: "(max-width: 768px)",
      gap: 16,
      peek: 0.08,
      rotateY: 18,
      zDepth: 72,
      scaleDrop: 0.06,
      blurMax: 1.2,
      maxSlideWidth: 300,
    },
    {
      mq: "(max-width: 560px)",
      gap: 12,
      peek: 0.06,
      rotateY: 12,
      zDepth: 48,
      scaleDrop: 0.05,
      blurMax: 0.8,
      maxSlideWidth: 280,
    },
  ],
}

function mod(i: number, n: number) {
  return ((i % n) + n) % n
}

export function getCareerCarouselScrollDistance(
  slideCount: number,
  slideSpan: number,
) {
  if (slideCount <= 1) return 0
  return Math.round((slideCount - 1) * slideSpan * 0.82)
}

export function usePerspectiveCarousel(
  slideCount: number,
  rootRef: RefObject<HTMLElement | null>,
  viewportRef: RefObject<HTMLElement | null>,
  slideRefs: RefObject<(HTMLElement | null)[]>,
  options: PerspectiveCarouselOptions = {},
) {
  const optsRef = useRef({ ...DEFAULT_OPTS, ...options })
  optsRef.current = {
    ...DEFAULT_OPTS,
    ...options,
    breakpoints: options.breakpoints ?? DEFAULT_OPTS.breakpoints,
  }

  const stateRef = useRef<CarouselState>({
    index: 0,
    pos: 0,
    width: 0,
    gap: optsRef.current.gap,
  })

  const slideWRef = useRef(320)
  const isFFRef = useRef(false)
  const roRef = useRef<ResizeObserver | null>(null)

  const render = useCallback(
    (markActive = false) => {
      const root = rootRef.current
      const slides = slideRefs.current
      const opts = optsRef.current
      const state = stateRef.current
      if (!root || !slides.length) return

      const span = slideWRef.current + state.gap
      const tiltX = parseFloat(
        root.style.getPropertyValue("--career-tilt-x") || "0",
      )
      const tiltY = parseFloat(
        root.style.getPropertyValue("--career-tilt-y") || "0",
      )

      for (let i = 0; i < slideCount; i++) {
        const el = slides[i]
        if (!el) continue

        let d = i - state.pos
        if (d > slideCount / 2) d -= slideCount
        if (d < -slideCount / 2) d += slideCount

        const weight = Math.max(0, 1 - Math.abs(d) * 2)
        const biasActive = -slideWRef.current * opts.activeLeftBias * weight
        const tx = d * span + biasActive
        const depth = -Math.abs(d) * opts.zDepth
        const rot = -d * opts.rotateY
        const scale = 1 - Math.min(Math.abs(d) * opts.scaleDrop, 0.38)
        const blur = Math.min(Math.abs(d) * opts.blurMax, opts.blurMax)
        const z = Math.round(1000 - Math.abs(d) * 10)

        if (isFFRef.current) {
          el.style.transform = `translate(${tx}px, -50%) scale(${scale})`
          el.style.filter = "none"
        } else {
          el.style.transform = `translate3d(${tx}px, -50%, ${depth}px) rotateY(${rot}deg) scale(${scale})`
          el.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none"
        }

        el.style.zIndex = String(z)

        if (markActive) {
          el.dataset.state =
            mod(Math.round(state.index), slideCount) === i ? "active" : "rest"
        }

        const parBase = Math.max(-1, Math.min(1, -d))
        el.style.setProperty(
          "--career-par-x",
          `${(parBase * 24 + tiltY * 1.5).toFixed(2)}px`,
        )
        el.style.setProperty(
          "--career-par-y",
          `${(tiltX * -1.2).toFixed(2)}px`,
        )
      }

    },
    [rootRef, slideCount, slideRefs],
  )

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const opts = optsRef.current
    if (!viewport) return

    const viewRect = viewport.getBoundingClientRect()
    stateRef.current.width = viewRect.width
    stateRef.current.gap = opts.gap
    slideWRef.current = Math.min(
      opts.maxSlideWidth,
      viewRect.width * (1 - opts.peek * 2),
    )
    rootRef.current?.style.setProperty(
      "--career-slide-w",
      `${Math.round(slideWRef.current)}px`,
    )
    render(true)
  }, [render, rootRef, viewportRef])

  const setScrollProgress = useCallback(
    (progress: number) => {
      const state = stateRef.current
      const clamped = Math.max(0, Math.min(1, progress))
      const maxPos = Math.max(0, slideCount - 1)
      state.pos = clamped * maxPos
      state.index = Math.round(state.pos)
      render(true)
    },
    [render, slideCount],
  )

  const getScrollDistance = useCallback(() => {
    const span = slideWRef.current + stateRef.current.gap
    return getCareerCarouselScrollDistance(slideCount, span)
  }, [slideCount])

  useEffect(() => {
    if (typeof window === "undefined") return
    isFFRef.current =
      typeof (window as Window & { InstallTrigger?: unknown })
        .InstallTrigger !== "undefined"

    const opts = optsRef.current
    if (isFFRef.current) {
      opts.rotateY = 8
      opts.zDepth = 0
      opts.blurMax = 0
    }

    const viewport = viewportRef.current
    const root = rootRef.current
    if (!viewport || !root) return

    const onTilt = (e: PointerEvent) => {
      const r = viewport.getBoundingClientRect()
      const mx = (e.clientX - r.left) / r.width - 0.5
      const my = (e.clientY - r.top) / r.height - 0.5
      root.style.setProperty("--career-tilt-x", (my * -4).toFixed(3))
      root.style.setProperty("--career-tilt-y", (mx * 4).toFixed(3))
      render()
    }

    viewport.addEventListener("pointermove", onTilt)

    const mediaCleanups: (() => void)[] = []
    opts.breakpoints.forEach((bp) => {
      const m = window.matchMedia(bp.mq)
      const apply = () => {
        Object.entries(bp).forEach(([key, val]) => {
          if (key !== "mq") {
            ;(optsRef.current as Record<string, unknown>)[key] = val
          }
        })
        measure()
      }
      if (m.matches) apply()
      m.addEventListener("change", apply)
      mediaCleanups.push(() => m.removeEventListener("change", apply))
    })

    roRef.current = new ResizeObserver(measure)
    roRef.current.observe(viewport)

    measure()
    setScrollProgress(0)

    return () => {
      roRef.current?.disconnect()
      viewport.removeEventListener("pointermove", onTilt)
      mediaCleanups.forEach((fn) => fn())
    }
  }, [measure, render, rootRef, setScrollProgress, viewportRef])

  return { setScrollProgress, getScrollDistance, measure }
}

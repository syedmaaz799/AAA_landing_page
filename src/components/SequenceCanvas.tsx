"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react"

const BLOCKING_FRAME_COUNT = 16
const BLOCKING_CONCURRENCY = 12
const BACKGROUND_CONCURRENCY = 8
const MOBILE_PRELOAD_CONCURRENCY = 6
const MAX_DPR = 2
const MAX_DPR_MOBILE = 1.5

type FrameSource = HTMLImageElement | ImageBitmap

function isMobileCanvas(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(max-width: 1023px)").matches
}

export type SequenceCanvasHandle = {
  setFrame: (frame: number) => void
  redraw: () => void
}

type SequenceCanvasProps = {
  totalFrames: number
  framePath?: (frame: number) => string
  className?: string
  style?: CSSProperties
  onPreloadProgress?: (progress: number) => void
  onPreloadComplete?: () => void
}

function defaultFramePath(frame: number): string {
  return `/frames/frame-${String(frame).padStart(3, "0")}.jpg`
}

function disposeFrameSource(source: FrameSource) {
  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
    source.close()
  }
}

async function decodeImage(img: HTMLImageElement): Promise<void> {
  if (!img.complete || !img.naturalWidth) return
  if (typeof img.decode === "function") {
    try {
      await img.decode()
    } catch {
      // decode() can reject for broken images; draw path handles misses
    }
  }
}

async function loadAndDecodeFrame(
  frame: number,
  framePath: (frame: number) => string,
): Promise<FrameSource | null> {
  const img = new Image()
  img.decoding = "async"

  const loaded = await new Promise<boolean>((resolve) => {
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = framePath(frame)
  })

  if (!loaded || !img.complete || !img.naturalWidth) return null

  await decodeImage(img)

  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(img)
    } catch {
      return img
    }
  }

  return img
}

async function loadFramesInBatches(
  frames: number[],
  concurrency: number,
  store: Map<number, FrameSource>,
  onFrameLoaded: () => void,
  framePath: (frame: number) => string,
): Promise<void> {
  let index = 0

  async function worker() {
    while (index < frames.length) {
      const current = frames[index++]
      if (store.has(current)) continue

      const source = await loadAndDecodeFrame(current, framePath)
      if (source) store.set(current, source)
      onFrameLoaded()
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, frames.length) },
    () => worker(),
  )
  await Promise.all(workers)
}

export const SequenceCanvas = forwardRef<SequenceCanvasHandle, SequenceCanvasProps>(
  function SequenceCanvas(
    {
      totalFrames,
      framePath = defaultFramePath,
      className,
      style,
      onPreloadProgress,
      onPreloadComplete,
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const framesRef = useRef<Map<number, FrameSource>>(new Map())
    const frameRef = useRef(1)
    const drawnFrameRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)
    const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
    const onPreloadProgressRef = useRef(onPreloadProgress)
    const onPreloadCompleteRef = useRef(onPreloadComplete)
    const framePathRef = useRef(framePath)

    onPreloadProgressRef.current = onPreloadProgress
    onPreloadCompleteRef.current = onPreloadComplete
    framePathRef.current = framePath

    const findNearestLoadedFrame = useCallback((target: number): number | null => {
      const frames = framesRef.current
      if (frames.has(target)) return target

      for (let offset = 1; offset < totalFrames; offset++) {
        const before = target - offset
        const after = target + offset
        if (before >= 1 && frames.has(before)) return before
        if (after <= totalFrames && frames.has(after)) return after
      }
      return null
    }, [totalFrames])

    const drawFrame = useCallback(
      (force = false) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const { width, height, dpr } = sizeRef.current
        if (!width || !height) return

        const target = Math.round(
          Math.min(totalFrames, Math.max(1, frameRef.current)),
        )

        if (!force && drawnFrameRef.current === target) return

        const nearest = findNearestLoadedFrame(target)
        if (!nearest) return

        const source = framesRef.current.get(nearest)
        if (!source) return

        const cw = width * dpr
        const ch = height * dpr
        const iw =
          source instanceof ImageBitmap ? source.width : source.naturalWidth
        const ih =
          source instanceof ImageBitmap ? source.height : source.naturalHeight
        if (!iw || !ih) return

        const scale = Math.max(cw / iw, ch / ih)
        const dw = iw * scale
        const dh = ih * scale
        const dx = (cw - dw) / 2
        const dy = (ch - dh) / 2

        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, cw, ch)
        ctx.drawImage(source, dx, dy, dw, dh)
        drawnFrameRef.current = target
      },
      [findNearestLoadedFrame, totalFrames],
    )

    const scheduleDraw = useCallback(
      (force = false) => {
        if (rafRef.current !== null) return
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null
          drawFrame(force)
        })
      },
      [drawFrame],
    )

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const parent = canvas.parentElement
      const width =
        parent?.clientWidth ||
        parent?.getBoundingClientRect().width ||
        window.innerWidth
      const height =
        parent?.clientHeight ||
        parent?.getBoundingClientRect().height ||
        window.innerHeight

      if (!width || !height) return

      const maxDpr = isMobileCanvas() ? MAX_DPR_MOBILE : MAX_DPR
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)

      sizeRef.current = { width, height, dpr }
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      drawnFrameRef.current = null
      scheduleDraw(true)
    }, [scheduleDraw])

    useImperativeHandle(
      ref,
      () => ({
        setFrame(frame: number) {
          const next = Math.round(
            Math.min(totalFrames, Math.max(1, frame)),
          )
          if (frameRef.current === next) return
          frameRef.current = next
          scheduleDraw()
        },
        redraw() {
          drawnFrameRef.current = null
          scheduleDraw(true)
        },
      }),
      [scheduleDraw, totalFrames],
    )

    useEffect(() => {
      resizeCanvas()

      const canvas = canvasRef.current
      const parent = canvas?.parentElement

      const ro =
        parent && typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => resizeCanvas())
          : null

      ro?.observe(parent!)

      window.addEventListener("resize", resizeCanvas)
      window.visualViewport?.addEventListener("resize", resizeCanvas)

      return () => {
        ro?.disconnect()
        window.removeEventListener("resize", resizeCanvas)
        window.visualViewport?.removeEventListener("resize", resizeCanvas)
      }
    }, [resizeCanvas])

    useEffect(() => {
      const store = framesRef.current
      for (const source of store.values()) {
        disposeFrameSource(source)
      }
      store.clear()
      drawnFrameRef.current = null

      const mobile = isMobileCanvas()
      const allFrames = Array.from({ length: totalFrames }, (_, i) => i + 1)

      let loaded = 0
      let unlockReported = false

      const reportProgress = () => {
        loaded++
        onPreloadProgressRef.current?.(loaded / totalFrames)
      }

      const reportUnlock = () => {
        if (unlockReported) return
        unlockReported = true
        onPreloadCompleteRef.current?.()
        scheduleDraw(true)
      }

      let cancelled = false

      ;(async () => {
        if (mobile) {
          await loadFramesInBatches(
            allFrames,
            MOBILE_PRELOAD_CONCURRENCY,
            store,
            reportProgress,
            framePathRef.current,
          )

          if (cancelled) return
          reportUnlock()
          return
        }

        const blockingFrames = allFrames.slice(0, BLOCKING_FRAME_COUNT)
        const backgroundFrames = allFrames.slice(BLOCKING_FRAME_COUNT)

        await loadFramesInBatches(
          blockingFrames,
          BLOCKING_CONCURRENCY,
          store,
          reportProgress,
          framePathRef.current,
        )

        if (cancelled) return
        reportUnlock()

        void loadFramesInBatches(
          backgroundFrames,
          BACKGROUND_CONCURRENCY,
          store,
          reportProgress,
          framePathRef.current,
        )
      })()

      return () => {
        cancelled = true
        for (const source of store.values()) {
          disposeFrameSource(source)
        }
        store.clear()
      }
    }, [totalFrames, scheduleDraw])

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={style}
        aria-hidden
      />
    )
  },
)

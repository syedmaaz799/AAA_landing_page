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
const BLOCKING_FRAME_COUNT_MOBILE = 40
const BLOCKING_CONCURRENCY = 12
const BLOCKING_CONCURRENCY_MOBILE = 6
const BACKGROUND_CONCURRENCY = 8
const BACKGROUND_CONCURRENCY_MOBILE = 4
const MAX_DPR = 2
const MAX_DPR_MOBILE = 1.5

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

async function loadFramesInBatches(
  frames: number[],
  concurrency: number,
  images: Map<number, HTMLImageElement>,
  onFrameLoaded: () => void,
  framePath: (frame: number) => string,
): Promise<void> {
  let index = 0

  async function worker() {
    while (index < frames.length) {
      const current = frames[index++]
      if (images.has(current)) continue

      await new Promise<void>((resolve) => {
        const img = new Image()
        img.decoding = "async"
        img.onload = () => {
          images.set(current, img)
          onFrameLoaded()
          resolve()
        }
        img.onerror = () => {
          onFrameLoaded()
          resolve()
        }
        img.src = framePath(current)
      })
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
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map())
    const frameRef = useRef(1)
    const rafRef = useRef<number | null>(null)
    const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
    const onPreloadProgressRef = useRef(onPreloadProgress)
    const onPreloadCompleteRef = useRef(onPreloadComplete)
    const framePathRef = useRef(framePath)

    onPreloadProgressRef.current = onPreloadProgress
    onPreloadCompleteRef.current = onPreloadComplete
    framePathRef.current = framePath

    const findNearestLoadedFrame = useCallback((target: number): number | null => {
      const images = imagesRef.current
      if (images.has(target)) return target

      for (let offset = 1; offset < totalFrames; offset++) {
        const before = target - offset
        const after = target + offset
        if (before >= 1 && images.has(before)) return before
        if (after <= totalFrames && images.has(after)) return after
      }
      return null
    }, [totalFrames])

    const drawFrame = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const { width, height, dpr } = sizeRef.current
      if (!width || !height) return

      const target = Math.round(
        Math.min(totalFrames, Math.max(1, frameRef.current)),
      )
      const nearest = findNearestLoadedFrame(target)
      if (!nearest) return

      const img = imagesRef.current.get(nearest)
      if (!img?.complete || !img.naturalWidth) return

      const cw = width * dpr
      const ch = height * dpr
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }, [findNearestLoadedFrame, totalFrames])

    const scheduleDraw = useCallback(() => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        drawFrame()
      })
    }, [drawFrame])

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

      scheduleDraw()
    }, [scheduleDraw])

    useImperativeHandle(
      ref,
      () => ({
        setFrame(frame: number) {
          frameRef.current = frame
          scheduleDraw()
        },
        redraw() {
          scheduleDraw()
        },
      }),
      [scheduleDraw],
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
      const images = imagesRef.current
      images.clear()

      const mobile = isMobileCanvas()
      const blockingCount = mobile
        ? BLOCKING_FRAME_COUNT_MOBILE
        : BLOCKING_FRAME_COUNT
      const blockingConcurrency = mobile
        ? BLOCKING_CONCURRENCY_MOBILE
        : BLOCKING_CONCURRENCY
      const backgroundConcurrency = mobile
        ? BACKGROUND_CONCURRENCY_MOBILE
        : BACKGROUND_CONCURRENCY

      const allFrames = Array.from({ length: totalFrames }, (_, i) => i + 1)
      const blockingFrames = allFrames.slice(0, blockingCount)
      const backgroundFrames = allFrames.slice(blockingCount)

      let loaded = 0
      let firstFrameReported = false

      const reportProgress = () => {
        loaded++
        const progress = loaded / totalFrames
        onPreloadProgressRef.current?.(progress)

        if (!firstFrameReported && images.size >= 1) {
          firstFrameReported = true
          onPreloadCompleteRef.current?.()
          scheduleDraw()
        }
      }

      let cancelled = false

      ;(async () => {
        await loadFramesInBatches(
          blockingFrames,
          blockingConcurrency,
          images,
          reportProgress,
          framePathRef.current,
        )

        if (cancelled) return

        if (!firstFrameReported) {
          firstFrameReported = true
          onPreloadCompleteRef.current?.()
          scheduleDraw()
        }

        void loadFramesInBatches(
          backgroundFrames,
          backgroundConcurrency,
          images,
          reportProgress,
          framePathRef.current,
        )
      })()

      return () => {
        cancelled = true
        images.clear()
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

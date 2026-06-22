"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react"
import {
  getWorkflowFrameCache,
  isWorkflowPreloadComplete,
  preloadWorkflowFrames,
} from "@/lib/workflow-frame-cache"

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

export const SequenceCanvas = forwardRef<SequenceCanvasHandle, SequenceCanvasProps>(
  function SequenceCanvas(
    {
      totalFrames,
      framePath,
      className,
      style,
      onPreloadProgress,
      onPreloadComplete,
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const frameRef = useRef(1)
    const drawnFrameRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)
    const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
    const onPreloadProgressRef = useRef(onPreloadProgress)
    const onPreloadCompleteRef = useRef(onPreloadComplete)

    onPreloadProgressRef.current = onPreloadProgress
    onPreloadCompleteRef.current = onPreloadComplete

    const getFrames = useCallback(() => getWorkflowFrameCache(), [])

    const findNearestLoadedFrame = useCallback(
      (target: number): number | null => {
        const frames = getFrames()
        if (frames.has(target)) return target

        for (let offset = 1; offset < totalFrames; offset++) {
          const before = target - offset
          const after = target + offset
          if (before >= 1 && frames.has(before)) return before
          if (after <= totalFrames && frames.has(after)) return after
        }
        return null
      },
      [getFrames, totalFrames],
    )

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

        const source = getFrames().get(nearest)
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
      [findNearestLoadedFrame, getFrames, totalFrames],
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
      drawnFrameRef.current = null
      let cancelled = false

      const finish = () => {
        if (cancelled) return
        onPreloadCompleteRef.current?.()
        scheduleDraw(true)
      }

      if (isWorkflowPreloadComplete()) {
        onPreloadProgressRef.current?.(1)
        finish()
        return () => {
          cancelled = true
        }
      }

      void preloadWorkflowFrames({
        framePath,
        onProgress: (progress) => {
          if (!cancelled) onPreloadProgressRef.current?.(progress)
        },
      }).then(() => {
        if (!cancelled) finish()
      })

      return () => {
        cancelled = true
      }
    }, [framePath, scheduleDraw, totalFrames])

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

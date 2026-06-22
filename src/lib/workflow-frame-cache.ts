import { TOTAL_FRAMES } from "@/lib/sections"

export type FrameSource = HTMLImageElement | ImageBitmap

const MOBILE_PRELOAD_CONCURRENCY = 6
const DESKTOP_PRELOAD_CONCURRENCY = 10
const MAX_BOOT_MS = 15000
const MIN_SPLASH_MS = 900

const frameCache = new Map<number, FrameSource>()

let preloadPromise: Promise<void> | null = null
let preloadComplete = false
let loadedCount = 0

export function defaultWorkflowFramePath(frame: number): string {
  return `/frames/frame-${String(frame).padStart(3, "0")}.jpg`
}

export function getWorkflowFrameCache(): Map<number, FrameSource> {
  return frameCache
}

export function isWorkflowPreloadComplete(): boolean {
  return preloadComplete
}

export function getWorkflowPreloadProgress(): number {
  return loadedCount / TOTAL_FRAMES
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(max-width: 1023px)").matches
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
      /* draw path handles misses */
    }
  }
}

async function loadAndDecodeFrame(
  frame: number,
  framePath: (frame: number) => string,
): Promise<FrameSource | null> {
  const cached = frameCache.get(frame)
  if (cached) return cached

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
  onFrameLoaded: () => void,
  framePath: (frame: number) => string,
): Promise<void> {
  let index = 0

  async function worker() {
    while (index < frames.length) {
      const current = frames[index++]
      if (frameCache.has(current)) {
        onFrameLoaded()
        continue
      }

      const source = await loadAndDecodeFrame(current, framePath)
      if (source) frameCache.set(current, source)
      onFrameLoaded()
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, frames.length) }, () => worker()),
  )
}

export type PreloadWorkflowFramesOptions = {
  onProgress?: (progress: number) => void
  framePath?: (frame: number) => string
}

export function preloadWorkflowFrames(
  options: PreloadWorkflowFramesOptions = {},
): Promise<void> {
  if (preloadComplete) {
    options.onProgress?.(1)
    return Promise.resolve()
  }

  if (preloadPromise) {
    return preloadPromise.then(() => {
      options.onProgress?.(getWorkflowPreloadProgress())
    })
  }

  const framePath = options.framePath ?? defaultWorkflowFramePath
  const allFrames = Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1)
  const concurrency = isMobileViewport()
    ? MOBILE_PRELOAD_CONCURRENCY
    : DESKTOP_PRELOAD_CONCURRENCY

  loadedCount = frameCache.size

  preloadPromise = loadFramesInBatches(
    allFrames,
    concurrency,
    () => {
      loadedCount = frameCache.size
      options.onProgress?.(loadedCount / TOTAL_FRAMES)
    },
    framePath,
  ).then(() => {
    preloadComplete = true
    options.onProgress?.(1)
  })

  return preloadPromise
}

export function waitForPageReady(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()

  const fontsReady = document.fonts?.ready ?? Promise.resolve()

  const loadReady = new Promise<void>((resolve) => {
    if (document.readyState === "complete") {
      resolve()
      return
    }

    window.addEventListener("load", () => resolve(), { once: true })
  })

  const logoReady = new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = "/brand/nv-logo-updated.png"
  })

  return Promise.all([loadReady, fontsReady, logoReady]).then(() => undefined)
}

export async function bootApplication(
  onProgress: (progress: number) => void,
): Promise<void> {
  const startedAt = performance.now()
  let pageReady = false
  let frameProgress = frameCache.size / TOTAL_FRAMES

  const report = () => {
    const pageWeight = pageReady ? 1 : 0
    const combined = pageWeight * 0.18 + frameProgress * 0.82
    onProgress(Math.min(1, combined))
  }

  report()

  const pagePromise = waitForPageReady().then(() => {
    pageReady = true
    report()
  })

  const framePromise = preloadWorkflowFrames({
    onProgress: (progress) => {
      frameProgress = progress
      report()
    },
  })

  const timeoutPromise = new Promise<void>((resolve) => {
    window.setTimeout(resolve, MAX_BOOT_MS)
  })

  await Promise.race([
    Promise.all([pagePromise, framePromise]),
    timeoutPromise,
  ])

  const elapsed = performance.now() - startedAt
  if (elapsed < MIN_SPLASH_MS) {
    await new Promise((resolve) =>
      window.setTimeout(resolve, MIN_SPLASH_MS - elapsed),
    )
  }

  onProgress(1)
}

export function resetWorkflowFrameCacheForTests() {
  for (const source of frameCache.values()) {
    disposeFrameSource(source)
  }
  frameCache.clear()
  preloadPromise = null
  preloadComplete = false
  loadedCount = 0
}

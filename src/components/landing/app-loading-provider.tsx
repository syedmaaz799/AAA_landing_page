"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LoadingScreen } from "@/components/landing/loading-screen"

gsap.registerPlugin(ScrollTrigger)

const MIN_SPLASH_MS = 600

type AppLoadingContextValue = {
  isReady: boolean
  progress: number
}

const AppLoadingContext = createContext<AppLoadingContextValue>({
  isReady: false,
  progress: 0,
})

export function useAppLoading() {
  return useContext(AppLoadingContext)
}

async function bootApplication(onProgress: (progress: number) => void) {
  const startedAt = performance.now()

  onProgress(0.2)

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

  onProgress(0.55)
  await Promise.all([loadReady, fontsReady, logoReady])
  onProgress(0.9)

  const elapsed = performance.now() - startedAt
  if (elapsed < MIN_SPLASH_MS) {
    await new Promise((resolve) =>
      window.setTimeout(resolve, MIN_SPLASH_MS - elapsed),
    )
  }

  onProgress(1)
}

export function AppLoadingProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false

    void bootApplication((value) => {
      if (!cancelled) setProgress(value)
    }).then(() => {
      if (cancelled) return
      setProgress(1)
      setIsReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isReady) return

    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      ScrollTrigger.update()
    })
  }, [isReady])

  const value = useMemo(
    () => ({
      isReady,
      progress,
    }),
    [isReady, progress],
  )

  return (
    <AppLoadingContext.Provider value={value}>
      <LoadingScreen visible={!isReady} progress={progress} />
      {isReady ? children : null}
    </AppLoadingContext.Provider>
  )
}

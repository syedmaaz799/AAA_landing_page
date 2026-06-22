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
import { bootApplication } from "@/lib/workflow-frame-cache"
import { LoadingScreen } from "@/components/landing/loading-screen"

gsap.registerPlugin(ScrollTrigger)

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

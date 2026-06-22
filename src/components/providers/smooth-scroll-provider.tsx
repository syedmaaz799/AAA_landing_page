"use client"

import { ReactLenis, useLenis } from "lenis/react"
import { getAnchorScrollTarget } from "@/lib/anchor-scroll"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { frame } from "motion-dom"
import { useEffect, type ReactNode } from "react"

gsap.registerPlugin(ScrollTrigger)

function AnchorScrollHandler() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const scrollToAnchor = (hash: string) => {
      const element = document.querySelector(hash) as HTMLElement | null
      if (!element) return false

      ScrollTrigger.refresh()

      const target = getAnchorScrollTarget(element, lenis.scroll)

      lenis.scrollTo(target, {
        duration: 1.2,
        onComplete: () => {
          ScrollTrigger.refresh()
          ScrollTrigger.update()
        },
      })
      return true
    }

    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('a[href^="#"]')
      if (!target) return

      const href = target.getAttribute("href")
      if (!href || href === "#") return

      const element = document.querySelector(href) as HTMLElement | null
      if (!element) return

      event.preventDefault()
      scrollToAnchor(href)
    }

    const handleHashLoad = () => {
      const hash = window.location.hash
      if (!hash || hash === "#") return

      requestAnimationFrame(() => {
        scrollToAnchor(hash)
      })
    }

    document.addEventListener("click", handleClick)
    handleHashLoad()

    return () => document.removeEventListener("click", handleClick)
  }, [lenis])

  return null
}

function LenisScrollTriggerBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    ScrollTrigger.clearScrollMemory()
    gsap.ticker.lagSmoothing(0)

    lenis.on("scroll", ScrollTrigger.update)

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    const syncLayout = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }

    const onRefresh = () => {
      lenis.resize()
    }

    const onMobileViewportChange = () => {
      syncLayout()
    }

    const onPageShow = (event: PageTransitionEvent) => {
      ScrollTrigger.clearScrollMemory()
      syncLayout()
      if (event.persisted) {
        requestAnimationFrame(syncLayout)
        window.setTimeout(syncLayout, 200)
      }
    }

    ScrollTrigger.addEventListener("refresh", onRefresh)

    syncLayout()
    requestAnimationFrame(syncLayout)

    const t1 = window.setTimeout(syncLayout, 150)
    const t2 = window.setTimeout(syncLayout, 500)
    const t3 = window.setTimeout(syncLayout, 1000)

    window.addEventListener("load", syncLayout)
    window.addEventListener("pageshow", onPageShow)
    window.addEventListener("orientationchange", onMobileViewportChange)
    window.visualViewport?.addEventListener("resize", onMobileViewportChange)
    void document.fonts?.ready?.then(syncLayout)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.removeEventListener("load", syncLayout)
      window.removeEventListener("pageshow", onPageShow)
      window.removeEventListener("orientationchange", onMobileViewportChange)
      window.visualViewport?.removeEventListener("resize", onMobileViewportChange)
      lenis.off("scroll", ScrollTrigger.update)
      ScrollTrigger.removeEventListener("refresh", onRefresh)
    }
  }, [lenis])

  return null
}

function LenisFramerBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onScroll = () => {
      frame.read(() => {}, false, true)
      window.dispatchEvent(new Event("scroll"))
    }

    lenis.on("scroll", onScroll)
    return () => lenis.off("scroll", onScroll)
  }, [lenis])

  return null
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
        syncTouchLerp: 0.05,
        infinite: false,
        autoResize: true,
        syncTouch: true,
        lerp: 0.1,
      }}
    >
      <AnchorScrollHandler />
      <LenisScrollTriggerBridge />
      <LenisFramerBridge />
      {children}
    </ReactLenis>
  )
}

"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useLenis } from "lenis/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Bot,
  Brain,
  Database,
  GitBranch,
  MessageSquare,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import {
  SequenceCanvas,
  type SequenceCanvasHandle,
} from "@/components/SequenceCanvas"
import {
  TOTAL_FRAMES,
  WORKFLOW_SECTIONS,
  type WorkflowSection,
} from "@/lib/sections"

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const FADE_DESKTOP = 0.038
const Y_TRAVEL_DESKTOP = 40
const SCRUB_DESKTOP = 0.55
const DESKTOP_HANDOFF = 0.62

const STAGE_ICONS: LucideIcon[] = [
  MessageSquare,
  Brain,
  Database,
  Wrench,
  GitBranch,
  Bot,
]

function isCompactViewport(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(max-width: 1023px)").matches
}

function fixStaleWorkflowPin(
  root: HTMLElement,
  stage: HTMLElement,
  phraseEls: HTMLElement[],
  n: number,
  compact: boolean,
  frameState: { frame: number },
  canvasHandle: SequenceCanvasHandle | null,
) {
  const rootTop = root.getBoundingClientRect().top
  const stagePosition = window.getComputedStyle(stage).position

  if (stagePosition === "fixed" && rootTop > 50) {
    ScrollTrigger.refresh()
    ScrollTrigger.update()
    frameState.frame = 1
    canvasHandle?.setFrame(1)
    if (compact) {
      applyCompactPhraseState(phraseEls, 0, n)
    }
  }
}

function refreshWorkflowScrollTrigger() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
    ScrollTrigger.update()
  })
}

function activeStageIndex(progress: number, n: number): number {
  return Math.min(n - 1, Math.floor(progress * n + 1e-6))
}

function applyCompactPhraseState(
  phraseEls: HTMLElement[],
  progress: number,
  n: number,
  setters?: Array<{
    opacity: (value: number) => void
    y: (value: number) => void
  }>,
) {
  const active = activeStageIndex(progress, n)
  for (let i = 0; i < n; i++) {
    const on = i === active
    phraseEls[i].style.display = on ? "block" : "none"
    phraseEls[i].style.visibility = on ? "visible" : "hidden"
    phraseEls[i].style.opacity = on ? "1" : "0"
    phraseEls[i].style.transform = "translate3d(0,0,0)"
    phraseEls[i].setAttribute("aria-hidden", on ? "false" : "true")
    setters?.[i]?.opacity(on ? 1 : 0)
    setters?.[i]?.y(0)
  }
}

function phraseStateAt(
  progress: number,
  i: number,
  n: number,
  fade: number,
  yTravel: number,
): { opacity: number; y: number; zIndex: number } {
  const start = i / n
  const end = (i + 1) / n
  const handoff = fade * DESKTOP_HANDOFF
  const easeOut = gsap.parseEase("power3.out")
  const easeIn = gsap.parseEase("power3.in")

  const enterFrom = i === 0 ? 0 : start - handoff * 0.15
  const enterTo = (i === 0 ? 0 : start) + handoff
  const exitFrom = end - handoff
  const exitTo = end

  if (progress < enterFrom || progress > exitTo) {
    return { opacity: 0, y: 0, zIndex: 0 }
  }

  if (progress < enterTo) {
    const t = (progress - enterFrom) / (enterTo - enterFrom)
    const eased = easeOut(Math.min(1, Math.max(0, t)))
    return {
      opacity: eased,
      y: yTravel * (1 - eased),
      zIndex: 2,
    }
  }

  if (progress > exitFrom) {
    const t = (progress - exitFrom) / handoff
    const eased = easeIn(Math.min(1, Math.max(0, t)))
    return {
      opacity: 1 - eased,
      y: -yTravel * eased,
      zIndex: 1,
    }
  }

  return { opacity: 1, y: 0, zIndex: 1 }
}

function applyPhraseState(
  phraseEls: HTMLElement[],
  setters: Array<{
    opacity: (value: number) => void
    y: (value: number) => void
  }>,
  progress: number,
  n: number,
  compact: boolean,
) {
  if (compact) {
    applyCompactPhraseState(phraseEls, progress, n, setters)
    return
  }

  applyPhraseCrossfade(
    phraseEls,
    setters,
    progress,
    n,
    FADE_DESKTOP,
    Y_TRAVEL_DESKTOP,
  )
}

function applyPhraseCrossfade(
  phraseEls: HTMLElement[],
  setters: Array<{
    opacity: (value: number) => void
    y: (value: number) => void
  }>,
  progress: number,
  n: number,
  fade: number,
  yTravel: number,
) {
  for (let i = 0; i < n; i++) {
    const v = phraseStateAt(progress, i, n, fade, yTravel)
    setters[i].opacity(v.opacity)
    setters[i].y(v.y)
    phraseEls[i].style.display = v.opacity > 0.01 ? "block" : "none"
    phraseEls[i].style.visibility = v.opacity > 0.01 ? "visible" : "hidden"
    phraseEls[i].style.pointerEvents = v.opacity > 0.01 ? "auto" : "none"
    phraseEls[i].style.zIndex = String(v.zIndex)
    phraseEls[i].setAttribute(
      "aria-hidden",
      v.opacity > 0.01 ? "false" : "true",
    )
  }
}

function stageFillAt(progress: number, i: number, n: number): number {
  const stageStart = i / n
  const stageEnd = (i + 1) / n

  if (progress >= stageEnd) return 1
  if (progress <= stageStart) return 0
  return (progress - stageStart) / (stageEnd - stageStart)
}

function WorkflowAnchor() {
  return (
    <div className="workflow-anchor shrink-0">
      <p className="workflow-eyebrow flex items-center gap-2">
        <span className="workflow-eyebrow-dot" aria-hidden />
        NeuralVarsity · Workflow Assembly
      </p>
      <h2 className="workflow-anchor-title">
        Building your <span className="text-white">AI</span> workflow.
      </h2>
    </div>
  )
}

function WorkflowStagePanel({
  section,
  index,
  onPanelRef,
}: {
  section: WorkflowSection
  index: number
  onPanelRef: (el: HTMLDivElement | null) => void
}) {
  const Icon = STAGE_ICONS[index] ?? Bot

  return (
    <div
      ref={onPanelRef}
      className="phrase-panel absolute inset-0 overflow-hidden"
      aria-hidden={index !== 0}
    >
      <div className="flex h-full flex-col justify-start md:justify-center">
        <div className="workflow-stage-tag mb-4 flex items-center gap-3 md:mb-7">
          <div className="workflow-stage-icon flex items-center justify-center">
            <Icon className="size-4 text-[#7CC8FF] md:size-5" aria-hidden />
          </div>
          <div>
            <p className="workflow-stage-label">{section.label}</p>
            <p className="workflow-node">{section.node}</p>
          </div>
        </div>

        <h3 className="workflow-headline font-bold tracking-tight">
          {section.headline}
        </h3>

        <p className="workflow-description mt-3 max-w-md md:mt-5">
          {section.description}
        </p>

        <ul className="workflow-cap-list mt-4 md:mt-7">
          {section.capabilities.map((cap) => (
            <li key={cap} className="workflow-cap-item">
              {cap}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function WorkflowExperience() {
  const lenis = useLenis()
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasHandleRef = useRef<SequenceCanvasHandle>(null)
  const phrasePanelRefs = useRef<Array<HTMLDivElement | null>>([])
  const tickRefs = useRef<Array<HTMLDivElement | null>>([])
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null)

  const frameStateRef = useRef({ frame: 1 })
  const [isReady, setIsReady] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)

  const handlePreloadComplete = useCallback(() => {
    setIsReady(true)
    refreshWorkflowScrollTrigger()
    requestAnimationFrame(() => {
      canvasHandleRef.current?.redraw()
    })
  }, [])

  useEffect(() => {
    if (!lenis) return

    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return

    let cancelled = false
    let rafId = 0
    let retryId = 0
    let tickerCleanup: (() => void) | undefined
    const mm = gsap.matchMedia()

    const buildScrollTrigger = (compact: boolean) => {
      const phraseEls = phrasePanelRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      )
      const tickEls = tickRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      )
      const n = WORKFLOW_SECTIONS.length

      if (phraseEls.length !== n) return () => {}

      const scrub = compact ? true : SCRUB_DESKTOP

      const setters = phraseEls.map((el) => ({
        opacity: gsap.quickSetter(el, "opacity") as (value: number) => void,
        y: gsap.quickSetter(el, "y", "px") as (value: number) => void,
      }))

      const updateFrameOnTick = () => {
        canvasHandleRef.current?.setFrame(frameStateRef.current.frame)
      }

      gsap.ticker.add(updateFrameOnTick)
      tickerCleanup = () => gsap.ticker.remove(updateFrameOnTick)

      const ctx = gsap.context(() => {
        const tween = gsap.to(frameStateRef.current, {
          frame: TOTAL_FRAMES,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub,
            pin: stage,
            pinSpacing: false,
            pinType: compact ? "transform" : "fixed",
            anticipatePin: 0,
            invalidateOnRefresh: true,
            onRefresh(self) {
              self.update()
              canvasHandleRef.current?.redraw()
              applyPhraseState(
                phraseEls,
                setters,
                self.progress,
                n,
                compact,
              )
            },
            onToggle(self) {
              if (self.isActive) {
                requestAnimationFrame(() => {
                  canvasHandleRef.current?.redraw()
                })
              }
            },
            onUpdate(self) {
              const textProgress = self.progress

              applyPhraseState(
                phraseEls,
                setters,
                textProgress,
                n,
                compact,
              )

              if (!compact) {
                for (let i = 0; i < n; i++) {
                  const fill = stageFillAt(textProgress, i, n)
                  tickEls[i]?.style.setProperty("--fill", String(fill))
                }
              }
            },
          },
        })

        scrollTweenRef.current = tween
      }, root)

      applyPhraseState(phraseEls, setters, 0, n, compact)

      const syncPin = () => {
        lenis.resize()
        refreshWorkflowScrollTrigger()
        fixStaleWorkflowPin(
          root,
          stage,
          phraseEls,
          n,
          compact,
          frameStateRef.current,
          canvasHandleRef.current,
        )
      }

      syncPin()
      requestAnimationFrame(syncPin)

      return () => {
        tickerCleanup?.()
        tickerCleanup = undefined
        scrollTweenRef.current = null
        ctx.revert()
        refreshWorkflowScrollTrigger()
      }
    }

    const setup = () => {
      if (cancelled) return undefined

      const phraseCount = phrasePanelRefs.current.filter(Boolean).length
      if (phraseCount !== WORKFLOW_SECTIONS.length) return undefined

      mm.add("(max-width: 1023px)", () => buildScrollTrigger(true))
      mm.add("(min-width: 1024px)", () => buildScrollTrigger(false))

      const onMobileLayoutChange = () => {
        lenis.resize()
        refreshWorkflowScrollTrigger()
        canvasHandleRef.current?.redraw()
        const compact = isCompactViewport()
        const phraseEls = phrasePanelRefs.current.filter(
          (el): el is HTMLDivElement => el !== null,
        )
        fixStaleWorkflowPin(
          root,
          stage,
          phraseEls,
          WORKFLOW_SECTIONS.length,
          compact,
          frameStateRef.current,
          canvasHandleRef.current,
        )
      }

      const onPageShow = (event: PageTransitionEvent) => {
        ScrollTrigger.clearScrollMemory()
        onMobileLayoutChange()
        if (event.persisted) {
          window.setTimeout(onMobileLayoutChange, 200)
        }
      }

      window.addEventListener("orientationchange", onMobileLayoutChange)
      window.addEventListener("pageshow", onPageShow)
      window.visualViewport?.addEventListener("resize", onMobileLayoutChange)

      return () => {
        window.removeEventListener("orientationchange", onMobileLayoutChange)
        window.removeEventListener("pageshow", onPageShow)
        window.visualViewport?.removeEventListener("resize", onMobileLayoutChange)
        mm.revert()
        refreshWorkflowScrollTrigger()
      }
    }

    let cleanup: (() => void) | undefined

    const trySetup = () => {
      cleanup?.()
      cleanup = setup()
      if (!cleanup && !cancelled) {
        retryId = window.setTimeout(trySetup, 50)
      }
    }

    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(trySetup)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(retryId)
      cleanup?.()
    }
  }, [lenis])

  useEffect(() => {
    if (!isReady) return
    refreshWorkflowScrollTrigger()
  }, [isReady])

  return (
    <section
      id="workflow"
      ref={rootRef}
      className="workflow-section relative scroll-mt-28"
    >
      <div
        ref={stageRef}
        className="workflow-stage relative w-full overflow-hidden bg-[#02040b]"
      >
        <div
          className={`workflow-loading-overlay pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[#02040b] transition-opacity duration-500 ${
            isReady ? "pointer-events-none invisible opacity-0" : "opacity-100"
          }`}
          aria-hidden={isReady}
        >
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <p className="text-sm font-medium text-zinc-400">
              Preparing workflow preview…
            </p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#3FA9FF] transition-[width] duration-200"
                style={{ width: `${Math.round(preloadProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="workflow-blueprint pointer-events-none absolute inset-0" />
        <div className="workflow-glow pointer-events-none absolute inset-0" />
        <div className="workflow-edge-fade-top pointer-events-none absolute inset-x-0 top-0 z-[1]" />
        <div className="workflow-edge-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1]" />

        <div className="canvas-vignette absolute inset-0 z-0 md:left-[40%]">
          <SequenceCanvas
            ref={canvasHandleRef}
            totalFrames={TOTAL_FRAMES}
            className="workflow-sequence-canvas block h-full w-full"
            onPreloadProgress={setPreloadProgress}
            onPreloadComplete={handlePreloadComplete}
          />
        </div>

        <div className="workflow-readability pointer-events-none absolute inset-y-0 left-0 w-full md:w-[58%]" />

        <div className="workflow-text-column relative z-10 flex h-full w-full flex-col justify-start px-5 pb-[max(3rem,env(safe-area-inset-bottom))] pt-20 md:w-[48%] md:justify-center md:px-12 md:py-28 lg:px-20">
          <WorkflowAnchor />
          <div className="workflow-divider shrink-0" />
          <div className="phrase-stack relative isolate max-md:flex-none max-md:min-h-[280px] overflow-hidden md:min-h-[420px] md:flex-1 lg:min-h-[460px]">
            {WORKFLOW_SECTIONS.map((section, index) => (
              <WorkflowStagePanel
                key={section.step}
                section={section}
                index={index}
                onPanelRef={(el) => {
                  phrasePanelRefs.current[index] = el
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 right-6 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-10">
          {WORKFLOW_SECTIONS.map((section, index) => (
            <div
              key={section.step}
              ref={(el) => {
                tickRefs.current[index] = el
              }}
              className="workflow-tick relative h-10 w-1 overflow-hidden rounded-full bg-white/10"
              aria-hidden
            >
              <div className="workflow-tick-fill absolute inset-0 rounded-full bg-[#3FA9FF]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

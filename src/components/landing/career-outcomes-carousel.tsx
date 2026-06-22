"use client"

import { memo, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Bot,
  Briefcase,
  Building2,
  Crown,
  Laptop,
  Layers,
  Network,
  Rocket,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react"
import {
  CAREER_OUTCOMES,
  type CareerOutcome,
  type CareerOutcomeIcon,
} from "@/lib/landing-data"
import { usePerspectiveCarousel } from "@/components/landing/use-perspective-carousel"

gsap.registerPlugin(ScrollTrigger)

const ICON_MAP: Record<CareerOutcomeIcon, LucideIcon> = {
  bot: Bot,
  zap: Zap,
  layers: Layers,
  workflow: Workflow,
  briefcase: Briefcase,
  network: Network,
  building: Building2,
  laptop: Laptop,
  rocket: Rocket,
  crown: Crown,
}

const CareerCarouselCard = memo(function CareerCarouselCard({
  career,
}: {
  career: CareerOutcome
}) {
  const Icon = ICON_MAP[career.icon]

  return (
    <div className="career-outcome-card career-carousel-card h-full p-5 md:p-6">
      <div className="career-outcome-icon mb-4 shrink-0">
        <Icon className="size-6 text-[#3FA9FF]" aria-hidden="true" />
      </div>

      <h3 className="text-base font-bold leading-snug text-white md:text-[1.05rem]">
        {career.title}
      </h3>

      <p className="mt-2 text-sm font-semibold text-[#3FA9FF]">
        {career.salary}
      </p>

      <div className="mt-3 flex min-h-[3.25rem] flex-wrap gap-1.5">
        {career.skills.map((skill) => (
          <span key={skill} className="career-outcome-skill">
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-auto pt-4 text-xs leading-relaxed text-zinc-400 md:text-[0.8125rem]">
        {career.description}
      </p>
    </div>
  )
})

type CareerOutcomesCarouselProps = {
  sectionRef: React.RefObject<HTMLElement | null>
}

export function CareerOutcomesCarousel({
  sectionRef,
}: CareerOutcomesCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])

  const { setScrollProgress, getScrollDistance, measure } =
    usePerspectiveCarousel(
      CAREER_OUTCOMES.length,
      rootRef,
      viewportRef,
      slideRefs,
    )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reducedMotion.matches) {
      setScrollProgress(0)
      return
    }

    const mm = gsap.matchMedia()

    const buildScrollTrigger = (distanceScale: number, scrub: number) => {
      let ctx: gsap.Context | undefined

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.max(480, Math.round(getScrollDistance() * distanceScale))}`,
          scrub,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => setScrollProgress(self.progress),
        })
      }, section)

      measure()
      ScrollTrigger.refresh()

      const onResize = () => {
        measure()
        ScrollTrigger.refresh()
      }

      window.addEventListener("resize", onResize, { passive: true })

      return () => {
        window.removeEventListener("resize", onResize)
        ctx?.revert()
      }
    }

    mm.add("(min-width: 1024px)", () => buildScrollTrigger(1, 1))
    mm.add("(max-width: 1023px)", () => buildScrollTrigger(0.72, 0.85))

    return () => mm.revert()
  }, [getScrollDistance, measure, sectionRef, setScrollProgress])

  return (
    <div
      ref={rootRef}
      className="career-carousel relative mx-auto w-full max-w-[1600px]"
      aria-roledescription="carousel"
      aria-label="Career outcome paths"
    >
      <div ref={viewportRef} className="career-carousel-viewport">
        <div className="career-carousel-track">
          {CAREER_OUTCOMES.map((career, index) => (
            <article
              key={career.title}
              ref={(el) => {
                slideRefs.current[index] = el
              }}
              className="career-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${CAREER_OUTCOMES.length}: ${career.title}`}
            >
              <CareerCarouselCard career={career} />
            </article>
          ))}
        </div>
      </div>

      <p className="career-carousel-scroll-hint mt-6 text-center text-xs text-zinc-500">
        Scroll to explore all career paths
      </p>
    </div>
  )
}

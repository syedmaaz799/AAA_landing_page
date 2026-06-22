"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { motion } from "framer-motion"
import {
  Award,
  Bot,
  BriefcaseBusiness,
  Clock3,
  FolderKanban,
  GraduationCap,
  Infinity,
  Network,
  Presentation,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const revealEase = [0.22, 1, 0.36, 1] as const

type IncludeItem = {
  title: string
  description: string
  icon: LucideIcon
  featured?: boolean
}

const PROGRAM_INCLUDE_ITEMS: IncludeItem[] = [
  {
    title: "20 Live Instructor-Led Sessions",
    description:
      "Learn directly from industry experts through live interactive classes.",
    icon: Presentation,
  },
  {
    title: "80+ Hours Hands-On Learning",
    description:
      "Build real AI systems through intensive practical learning.",
    icon: Clock3,
  },
  {
    title: "10+ Projects & Assignments",
    description:
      "Gain real-world experience through guided projects and assignments.",
    icon: FolderKanban,
  },
  {
    title: "AI Business Automation Suite Capstone",
    description:
      "Build an end-to-end production-ready automation solution.",
    icon: BriefcaseBusiness,
    featured: true,
  },
  {
    title: "Your Own AI Employee",
    description:
      "Create and deploy your own AI employee capable of performing tasks.",
    icon: Bot,
    featured: true,
  },
  {
    title: "Community Access",
    description: "Collaborate with fellow learners and AI builders.",
    icon: Users,
  },
  {
    title: "Peer Network",
    description: "Build valuable relationships with future AI professionals.",
    icon: Network,
  },
  {
    title: "Session Recordings",
    description:
      "Access recordings anytime for revision and self-paced learning.",
    icon: Video,
  },
  {
    title: "NeuralVarsity Certification",
    description: "Earn a professional certificate showcasing your skills.",
    icon: Award,
  },
  {
    title: "Lifetime Community Access",
    description: "Stay connected with the community even after graduation.",
    icon: Infinity,
  },
  {
    title: "Career Guidance",
    description:
      "Receive mentorship and guidance to accelerate your career.",
    icon: GraduationCap,
    featured: true,
  },
]

function getHorizontalDistance(track: HTMLElement, viewport: HTMLElement) {
  return Math.max(0, track.scrollWidth - viewport.clientWidth)
}

function SectionHeader({ animated = true }: { animated?: boolean }) {
  if (!animated) {
    return (
      <header className="includes-section-header mx-auto w-full max-w-[850px] shrink-0 px-8 text-center">
        <span className="mb-4 inline-flex items-center rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase">
          Program Includes
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-tight">
          EVERYTHING YOU NEED TO SUCCEED
        </h2>
        <p className="mx-auto mt-4 max-w-[750px] text-base leading-relaxed text-white/75 md:text-lg">
          Everything you need to become an Agentic AI Engineer, build
          production-ready AI systems, and launch your career in AI and
          Automation.
        </p>
      </header>
    )
  }

  return (
    <header className="includes-section-header mx-auto mb-[100px] w-full max-w-[850px] px-8 text-center">
      <motion.span
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: revealEase }}
        className="mb-4 inline-flex items-center rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase"
      >
        Program Includes
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: revealEase }}
        className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-tight"
      >
        EVERYTHING YOU NEED TO SUCCEED
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: revealEase }}
        className="mx-auto mt-4 max-w-[750px] text-base leading-relaxed text-white/75 md:text-lg"
      >
        Everything you need to become an Agentic AI Engineer, build
        production-ready AI systems, and launch your career in AI and
        Automation.
      </motion.p>
    </header>
  )
}

function IncludeCard({ item }: { item: IncludeItem }) {
  const Icon = item.icon

  return (
    <article
      className={cn(
        "program-include-slide-card group relative flex h-auto min-h-[260px] w-[85vw] max-w-[380px] shrink-0 flex-col overflow-hidden rounded-[32px] border border-sky-500/[0.18] p-8 lg:h-[260px] lg:w-[380px] lg:min-w-[380px]",
        item.featured && "program-include-card-featured"
      )}
    >
      {item.featured && (
        <div
          className="program-include-featured-accent pointer-events-none absolute inset-0 rounded-[32px]"
          aria-hidden="true"
        />
      )}

      <div className="relative mb-6 flex size-16 shrink-0 items-center justify-center">
        <div className="program-include-icon-wrap flex size-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
          <Icon className="size-8 text-sky-300" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="relative mb-3 shrink-0 text-xl leading-tight font-bold text-white lg:mb-3">
        {item.title}
      </h3>
      <p className="relative min-h-0 flex-1 text-[15px] leading-[1.65] text-white/75">
        {item.description}
      </p>
    </article>
  )
}

function PinnedIncludesScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const section = sectionRef.current
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!section || !track || !viewport) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reducedMotion.matches) return

    const mm = gsap.matchMedia()

    const buildScrollTrigger = (
      endScale: number,
      scrub: number | boolean,
      pinType: "fixed" | "transform",
    ) => {
      let ctx: gsap.Context | undefined

      const refreshLayout = () => {
        lenis.resize()
        ScrollTrigger.refresh()
      }

      ctx = gsap.context(() => {
        gsap.set(track, { x: 0, force3D: true })

        gsap.to(track, {
          x: () => -getHorizontalDistance(track, viewport),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => {
              const distance = getHorizontalDistance(track, viewport)
              return `+=${Math.max(520, Math.round(distance * endScale))}`
            },
            scrub,
            pin: true,
            pinType,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh(self) {
              self.update()
            },
          },
        })
      }, section)

      refreshLayout()
      requestAnimationFrame(refreshLayout)
      const refreshTimer = window.setTimeout(refreshLayout, 350)

      window.addEventListener("resize", refreshLayout, { passive: true })
      window.addEventListener("orientationchange", refreshLayout, {
        passive: true,
      })
      window.visualViewport?.addEventListener("resize", refreshLayout)

      return () => {
        window.clearTimeout(refreshTimer)
        window.removeEventListener("resize", refreshLayout)
        window.removeEventListener("orientationchange", refreshLayout)
        window.visualViewport?.removeEventListener("resize", refreshLayout)
        ctx?.revert()
      }
    }

    mm.add("(min-width: 1024px)", () => buildScrollTrigger(1, 1, "fixed"))
    mm.add("(max-width: 1023px)", () => buildScrollTrigger(0.82, true, "transform"))

    return () => mm.revert()
  }, [lenis])

  return (
    <section
      ref={sectionRef}
      className="includes-scroll-section relative overflow-x-hidden overflow-y-visible"
      data-lenis-prevent-touch
    >
      <div className="includes-pin-panel flex h-screen w-full max-w-full flex-col justify-center overflow-hidden py-4 md:py-6">
        <div className="includes-pin-content mx-auto flex w-full max-w-full min-h-0 flex-col justify-center">
          <div className="includes-header-wrap mb-[clamp(0.75rem,2vh,6.25rem)] shrink-0">
            <SectionHeader animated={false} />
          </div>

          <div
            ref={viewportRef}
            className="includes-track-viewport mt-[clamp(0.5rem,2vh,3.75rem)] min-h-0 w-full flex-1 overflow-hidden"
          >
            <div ref={trackRef} className="includes-track">
              {PROGRAM_INCLUDE_ITEMS.map((item) => (
                <IncludeCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <p className="includes-scroll-hint mt-[clamp(0.75rem,2vh,2rem)] shrink-0 text-center text-xs text-zinc-500">
            Scroll to explore all program benefits →
          </p>
        </div>
      </div>
    </section>
  )
}

export function IncludesSection() {
  return (
    <div id="includes" className="scroll-mt-28">
      <PinnedIncludesScroll />
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
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

function getHorizontalDistance(track: HTMLElement) {
  return Math.max(0, track.scrollWidth - window.innerWidth + 80)
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

function IncludeCard({
  item,
  variant = "desktop",
}: {
  item: IncludeItem
  variant?: "desktop" | "mobile"
}) {
  const Icon = item.icon

  return (
    <article
      className={cn(
        "program-include-slide-card group relative flex shrink-0 flex-col overflow-hidden rounded-[32px] border border-sky-500/[0.18] p-8",
        variant === "desktop" &&
          "includes-desktop-card h-[260px] w-[380px] min-w-[380px]",
        variant === "mobile" &&
          "includes-mobile-card h-auto min-h-[260px] w-[90vw] max-w-[380px] snap-start",
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

      <h3
        className={cn(
          "relative shrink-0 font-bold leading-tight text-white",
          variant === "desktop" ? "mb-3 text-xl" : "mb-4 text-2xl"
        )}
      >
        {item.title}
      </h3>
      <p
        className={cn(
          "relative min-h-0 text-white/75",
          variant === "desktop"
            ? "flex-1 text-[15px] leading-[1.65]"
            : "text-base leading-[1.75] lg:text-lg lg:leading-[1.8]"
        )}
      >
        {item.description}
      </p>
    </article>
  )
}

function DesktopPinnedIncludes() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    let ctx: gsap.Context | undefined

    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px)", () => {
      ctx = gsap.context(() => {
        const buildAnimation = () => {
          gsap.set(track, { x: 0, force3D: true })

          gsap.to(track, {
            x: () => -getHorizontalDistance(track),
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getHorizontalDistance(track)}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          })
        }

        buildAnimation()
        ScrollTrigger.refresh()
      }, section)

      const onResize = () => {
        ScrollTrigger.refresh()
      }

      window.addEventListener("resize", onResize, { passive: true })

      return () => {
        window.removeEventListener("resize", onResize)
        ctx?.revert()
      }
    })

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="includes-scroll-section relative hidden overflow-x-hidden overflow-y-visible lg:block"
    >
      <div className="includes-pin-panel flex h-screen w-full max-w-full flex-col justify-center overflow-hidden py-6">
        <div className="includes-pin-content mx-auto flex w-full max-w-full flex-col justify-center">
          <div className="mb-[clamp(3rem,8vh,6.25rem)]">
            <SectionHeader animated={false} />
          </div>

          <div className="includes-track-viewport mt-[clamp(2rem,5vh,3.75rem)] w-full overflow-hidden">
            <div ref={trackRef} className="includes-track">
              {PROGRAM_INCLUDE_ITEMS.map((item) => (
                <IncludeCard key={item.title} item={item} variant="desktop" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MobileHorizontalCarousel() {
  return (
    <section className="includes-mobile-section relative overflow-x-hidden py-[140px] lg:hidden">
      <SectionHeader />

      <div className="includes-carousel mt-[60px] flex gap-8 overflow-x-auto overscroll-x-contain px-[5vw] pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROGRAM_INCLUDE_ITEMS.map((item) => (
          <IncludeCard key={item.title} item={item} variant="mobile" />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Swipe to explore all program benefits →
      </p>
    </section>
  )
}

export function IncludesSection() {
  return (
    <div id="includes" className="scroll-mt-28">
      <DesktopPinnedIncludes />
      <MobileHorizontalCarousel />
    </div>
  )
}

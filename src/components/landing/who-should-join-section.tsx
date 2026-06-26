"use client"

import "./who-should-join.css"

import { memo, useMemo } from "react"
import {
  ArrowRightLeft,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  Code,
  GraduationCap,
  Laptop,
  LineChart,
  Rocket,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react"
import {
  FadeUp,
  GlowButton,
  SectionLabel,
  SectionSubtitle,
} from "@/components/landing/motion"

type AudienceIcon =
  | "graduation"
  | "briefcase"
  | "laptop"
  | "code"
  | "terminal"
  | "chart"
  | "rocket"
  | "building"
  | "lineChart"
  | "sparkles"
  | "switch"
  | "brain"

export type AudienceCard = {
  title: string
  description: string
  icon: AudienceIcon
}

export const audiences: AudienceCard[] = [
  {
    title: "Students",
    description: "Learn future-proof AI skills before graduation.",
    icon: "graduation",
  },
  {
    title: "Fresh Graduates",
    description: "Build production-ready projects and become job-ready.",
    icon: "briefcase",
  },
  {
    title: "Working Professionals",
    description: "Upgrade your skills and transition into AI Automation.",
    icon: "laptop",
  },
  {
    title: "Developers",
    description: "Build AI agents, workflows, and multi-agent systems.",
    icon: "code",
  },
  {
    title: "Software Engineers",
    description: "Learn Agentic AI and modern automation architectures.",
    icon: "terminal",
  },
  {
    title: "Data Analysts",
    description: "Automate analytics and create AI-powered workflows.",
    icon: "chart",
  },
  {
    title: "Freelancers",
    description: "Launch AI services and automate client work.",
    icon: "rocket",
  },
  {
    title: "Business Owners",
    description: "Use AI agents to scale operations and reduce costs.",
    icon: "building",
  },
  {
    title: "Consultants",
    description: "Deliver AI transformation solutions to businesses.",
    icon: "lineChart",
  },
  {
    title: "Startup Founders",
    description: "Build AI products and automate company processes.",
    icon: "sparkles",
  },
  {
    title: "Career Switchers",
    description: "Break into the AI industry with real-world projects.",
    icon: "switch",
  },
  {
    title: "Non-Tech Professionals",
    description: "Build AI automations without a coding background.",
    icon: "brain",
  },
]

const ICON_MAP: Record<AudienceIcon, LucideIcon> = {
  graduation: GraduationCap,
  briefcase: Briefcase,
  laptop: Laptop,
  code: Code,
  terminal: Terminal,
  chart: BarChart3,
  rocket: Rocket,
  building: Building2,
  lineChart: LineChart,
  sparkles: Sparkles,
  switch: ArrowRightLeft,
  brain: Brain,
}

const ROW_ONE = audiences.slice(0, 6)
const ROW_TWO = audiences.slice(6, 12)

const PARTICLES = Array.from({ length: 14 }, (_, index) => ({
  left: `${(index * 17 + 4) % 100}%`,
  top: `${(index * 21 + 8) % 100}%`,
  size: 2 + (index % 2),
  delay: `${(index % 5) * 0.5}s`,
}))

const WhoJoinCard = memo(function WhoJoinCard({
  card,
}: {
  card: AudienceCard
  index: number
}) {
  const Icon = ICON_MAP[card.icon]

  return (
    <article className="who-join-card">
      <div className="who-join-card-float">
        <div className="who-join-card-surface">
          <div className="who-join-card-icon">
            <Icon aria-hidden="true" />
          </div>
          <div className="who-join-card-text">
            <h3 className="who-join-card-title">{card.title}</h3>
            <p className="who-join-card-desc">{card.description}</p>
          </div>
        </div>
      </div>
    </article>
  )
})

function WhoJoinMarqueeRow({
  cards,
  direction,
  rowIndex,
}: {
  cards: AudienceCard[]
  direction: "left" | "right"
  rowIndex: number
}) {
  const looped = useMemo(() => [...cards, ...cards], [cards])

  const trackClass =
    direction === "left" ? "who-join-track-top" : "who-join-track-bottom"

  return (
    <div className="who-join-row">
      <div className="who-join-fade who-join-fade-left" aria-hidden="true" />
      <div className="who-join-fade who-join-fade-right" aria-hidden="true" />
      <div className="who-join-viewport">
        <div className={`who-join-track ${trackClass}`}>
          {looped.map((card, index) => (
            <WhoJoinCard
              key={`${rowIndex}-${card.title}-${index}`}
              card={card}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function WhoShouldJoinSection() {
  return (
    <section id="who-should-join" className="who-join-section">
      <div className="who-join-bg" aria-hidden="true" />
      <div className="who-join-glow" aria-hidden="true" />
      <div className="who-join-streak" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="who-join-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
        <FadeUp className="mx-auto max-w-[900px] text-center">
          <SectionLabel>Who Should Join</SectionLabel>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            BUILD WITH AI.
            <span className="mt-2 block bg-gradient-to-r from-yellow-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              NO MATTER WHERE YOU START.
            </span>
          </h2>
          <SectionSubtitle className="mx-auto text-center text-white/75">
            Whether you&apos;re starting out or scaling up, this program is
            designed for anyone who wants to build AI agents, automate workflows,
            and future-proof their career.
          </SectionSubtitle>
        </FadeUp>

        <div className="who-join-wrapper">
          <WhoJoinMarqueeRow cards={ROW_ONE} direction="left" rowIndex={0} />
          <WhoJoinMarqueeRow cards={ROW_TWO} direction="right" rowIndex={1} />
        </div>

        <FadeUp className="relative mx-auto mt-16 flex max-w-[900px] flex-col items-center px-2 text-center md:mt-20">
          <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            No Matter Your Background, You Can Build With AI.
          </h3>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <GlowButton variant="primary" modalAction="enroll">
              Join Cohort 1
            </GlowButton>
            <GlowButton variant="secondary" modalAction="brochure">
              Download Brochure
            </GlowButton>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

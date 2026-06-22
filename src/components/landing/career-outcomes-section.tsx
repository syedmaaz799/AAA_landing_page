"use client"

import { memo } from "react"
import { motion } from "framer-motion"
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
import {
  FadeUp,
  SectionLabel,
  SectionSubtitle,
  SectionTitle,
} from "@/components/landing/motion"
import "./career-outcomes-section.css"

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

const PARTICLES = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 17 + 4) % 100}%`,
  top: `${(index * 11 + 8) % 100}%`,
  size: 2 + (index % 3),
  delay: `${(index % 8) * 0.55}s`,
  duration: `${4 + (index % 5)}s`,
}))

const CareerCard = memo(function CareerCard({
  career,
  index,
}: {
  career: CareerOutcome
  index: number
}) {
  const Icon = ICON_MAP[career.icon]

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="career-outcome-card group p-5 md:p-6"
    >
      <div className="career-outcome-icon mb-4 shrink-0">
        <Icon className="size-6 text-[#3FA9FF]" aria-hidden="true" />
      </div>

      <h3 className="text-base font-bold leading-snug text-white md:text-[1.05rem]">
        {career.title}
      </h3>

      <p className="mt-2 text-sm font-semibold text-[#3FA9FF]">{career.salary}</p>

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
    </motion.article>
  )
})

export function CareerOutcomesSection() {
  return (
    <section
      id="careers"
      className="career-outcomes-section relative scroll-mt-28 overflow-hidden border-t border-white/5 px-4 py-[120px] md:px-8 lg:px-12"
    >
      <div className="career-outcomes-ambient pointer-events-none absolute inset-0" />

      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="career-outcomes-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <FadeUp>
          <SectionLabel>Career Outcomes</SectionLabel>
          <SectionTitle>WHERE THIS PROGRAM CAN TAKE YOU</SectionTitle>
          <SectionSubtitle>
            Master AI Agents and Automation to unlock high-paying, future-proof
            career opportunities across industries.
          </SectionSubtitle>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {CAREER_OUTCOMES.map((career, index) => (
            <CareerCard key={career.title} career={career} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

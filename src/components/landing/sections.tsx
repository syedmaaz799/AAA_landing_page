"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Code2,
  Layers,
  Rocket,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"
import {
  AGENT_CAPABILITIES,
  CAPABILITIES,
  CURRICULUM,
  FAQS,
  MARQUEE_ROW_1,
  MARQUEE_ROW_2,
  PROGRAM_DIFFERENTIATORS,
  TOOL_BADGES,
} from "@/lib/landing-data"
import { WHATSAPP_BOOKING_URL } from "@/lib/whatsapp"
import { CountUp } from "@/components/landing/count-up"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { Marquee } from "@/components/landing/marquee"
import {
  FadeUp,
  GlassCard,
  GlowButton,
  Section,
  SectionLabel,
  SectionSubtitle,
  SectionTitle,
  StaggerGrid,
  StaggerItem,
} from "@/components/landing/motion"

const WHY_CARDS = [
  {
    icon: Bot,
    title: "AI Agents are replacing repetitive workflows.",
  },
  {
    icon: TrendingUp,
    title: "Organizations need automation talent immediately.",
  },
  {
    icon: Sparkles,
    title: "AI builders are becoming strategic assets.",
  },
]

const WHY_CHOOSE = [
  {
    icon: Code2,
    title: "Learn by Building",
    desc: "Build real AI systems through guided projects and hands-on implementation.",
  },
  {
    icon: Layers,
    title: "No-Code & Low-Code",
    desc: "Create powerful automations and intelligent agents without heavy engineering.",
  },
  {
    icon: Briefcase,
    title: "Career Ready From Day One",
    desc: "Build skills, portfolio, and confidence to get hired, freelance, or launch your own AI services.",
  },
  {
    icon: Rocket,
    title: "Production-Ready Projects",
    desc: "Every project is designed to solve real business problems.",
  },
]

export function WhyProgramSection() {
  return (
    <Section id="why" className="border-t border-orange-500/10">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionLabel>Why This Program Exists</SectionLabel>
          <SectionTitle>
            THE WORLD RUNS ON AI AGENTS NOW.
            <span className="mt-2 block text-zinc-500">
              MOST PEOPLE ARE STILL WATCHING FROM THE SIDELINES.
            </span>
          </SectionTitle>
          <SectionSubtitle>
            AI Agents are transforming how work gets done. They can:
          </SectionSubtitle>
        </FadeUp>

        <StaggerGrid className="mt-8 flex flex-wrap gap-3">
          {AGENT_CAPABILITIES.map((cap) => (
            <StaggerItem key={cap}>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-sm text-orange-200">
                <Zap className="size-3.5 text-orange-400" />
                {cap}
              </span>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeUp className="mt-8">
          <p className="max-w-3xl text-zinc-400">
            Organizations are rapidly adopting AI and automation and urgently
            need professionals who can build intelligent systems. This program
            exists to help you become one of those builders.
          </p>
        </FadeUp>

        <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-3">
          {WHY_CARDS.map(({ icon: Icon, title }) => (
            <StaggerItem key={title}>
              <GlassCard className="h-full">
                <Icon className="mb-4 size-8 text-orange-400" />
                <p className="text-lg font-medium text-zinc-200">{title}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </Section>
  )
}

export function WhyChooseSection() {
  return (
    <Section className="bg-white/[0.02]">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionLabel>Why NeuralVarsity</SectionLabel>
          <SectionTitle>WHY CHOOSE NEURALVARSITY</SectionTitle>
        </FadeUp>
        <StaggerGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <GlassCard className="h-full">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <Icon className="size-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {desc}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </Section>
  )
}

export { WhoShouldJoinSection } from "@/components/landing/who-should-join-section"

export function ToolsSection() {
  return (
    <Section className="overflow-hidden border-y border-orange-500/10 bg-orange-500/[0.03]">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="px-4 md:px-8">
          <div id="tools" className="scroll-mt-28">
            <SectionLabel>Tech Stack</SectionLabel>
            <SectionTitle>Master the Complete Agentic AI Tech Stack</SectionTitle>
            <SectionSubtitle>
              Learn the same tools used by AI startups, automation agencies, and
              modern businesses to build production-ready AI systems.
            </SectionSubtitle>
          </div>
        </FadeUp>

        <div className="mt-12 space-y-6">
          <Marquee items={MARQUEE_ROW_1} direction="right" speed={45} />
          <Marquee items={MARQUEE_ROW_2} direction="left" speed={50} />
        </div>

        <StaggerGrid className="mt-12 flex flex-wrap justify-center gap-x-5 gap-y-4 px-4 md:gap-x-6 md:gap-y-5">
          {TOOL_BADGES.map((badge) => (
            <StaggerItem key={badge} className="shrink-0">
              <span className="inline-flex whitespace-nowrap rounded-full border border-white/10 bg-gradient-to-r from-orange-500/10 to-amber-500/5 px-4 py-2 text-xs font-medium text-zinc-300 md:text-sm">
                {badge}
              </span>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </Section>
  )
}

export function CurriculumSection() {
  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <div id="curriculum" className="scroll-mt-28">
            <SectionLabel>Curriculum</SectionLabel>
            <SectionTitle>4-WEEK AI AGENTS & AUTOMATION MASTER PROGRAM</SectionTitle>
            <SectionSubtitle>
              A structured, hands-on journey from AI foundations to deploying
              your own AI Employee.
            </SectionSubtitle>
          </div>
        </FadeUp>

        <div className="relative mt-16">
          <div className="absolute top-0 left-4 h-full w-px bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent md:left-1/2 md:-translate-x-px" />

          {CURRICULUM.map((week, index) => (
            <FadeUp key={week.week} delay={index * 0.1}>
              <div
                className={`relative mb-12 flex flex-col gap-8 md:flex-row md:items-start ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden flex-1 md:block" />
                <div className="absolute left-4 z-10 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border border-orange-500/50 bg-black md:left-1/2">
                  <span className="text-xs font-bold text-orange-400">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 pl-12 md:pl-0">
                  <GlassCard>
                    <div className="mb-2 text-sm font-semibold tracking-wider text-orange-400 uppercase">
                      {week.week}
                    </div>
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      {week.title}
                    </h3>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {week.topics.map((topic) => (
                        <li
                          key={topic}
                          className="flex items-start gap-2 text-sm text-zinc-400"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-500/70" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                      <span className="text-xs font-semibold tracking-wider text-orange-400 uppercase">
                        Week Outcome
                      </span>
                      <p className="mt-1 text-sm text-zinc-300">{week.outcome}</p>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  )
}

export { GraduationSection } from "@/components/landing/graduation-section"

export function CapabilitiesSection() {
  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionLabel>Skills</SectionLabel>
          <SectionTitle>CORE PROFESSIONAL CAPABILITIES</SectionTitle>
        </FadeUp>
        <StaggerGrid className="mt-12 flex flex-wrap gap-3">
          {CAPABILITIES.map((cap) => (
            <StaggerItem key={cap}>
              <span className="glass-card inline-block rounded-full px-5 py-2.5 text-sm font-medium text-zinc-300">
                {cap}
              </span>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </Section>
  )
}

export { ProjectsSection } from "@/components/landing/projects-section"
export { CareerOutcomesSection } from "@/components/landing/career-outcomes-section"

export function MarketSection() {
  const marketCards = [
    {
      key: "growth",
      stat: (
        <div className="text-4xl font-bold text-orange-400 md:text-5xl">
          <CountUp end={40} suffix="+" />%
        </div>
      ),
      description: "Growth in AI and Automation Roles",
    },
    {
      key: "freelance",
      stat: (
        <div className="text-3xl font-bold text-amber-300 md:text-4xl lg:text-5xl">
          ₹15K–₹75K
        </div>
      ),
      description: "Typical Freelance Automation Project Value",
    },
    {
      key: "roi",
      stat: (
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-orange-400 md:text-5xl">1</div>
          <p className="mt-1 text-lg font-medium text-zinc-200">Project</p>
        </div>
      ),
      description: "Can recover your entire program investment.",
    },
  ] as const

  return (
    <Section className="bg-gradient-to-b from-orange-500/5 to-transparent">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionLabel>Market Opportunity</SectionLabel>
          <SectionTitle>THE AI AUTOMATION ECONOMY IS BOOMING</SectionTitle>
        </FadeUp>
        <StaggerGrid className="mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {marketCards.map(({ key, stat, description }) => (
            <StaggerItem key={key} className="h-full">
              <GlassCard className="flex h-full min-h-[220px] flex-col items-center justify-center p-6 text-center md:min-h-[240px] md:p-8">
                <div className="flex min-h-[5.5rem] flex-col items-center justify-center">
                  {stat}
                </div>
                <p className="mt-4 min-h-[4.5rem] max-w-[18rem] text-sm leading-relaxed text-zinc-400 md:text-base">
                  {description}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </Section>
  )
}

export function DifferentiatorsSection() {
  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionLabel>Why Us</SectionLabel>
          <SectionTitle>WHAT MAKES THIS PROGRAM DIFFERENT</SectionTitle>
        </FadeUp>
        <StaggerGrid className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PROGRAM_DIFFERENTIATORS.map((item) => (
            <StaggerItem key={item}>
              <div className="flex items-center gap-3 rounded-xl border border-orange-500/15 bg-orange-500/[0.05] px-4 py-3">
                <CheckCircle2 className="size-4 shrink-0 text-orange-400" />
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </Section>
  )
}

export { IncludesSection } from "@/components/landing/includes-section"

export { PricingSection } from "@/components/landing/pricing-section"

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section className="border-t border-orange-500/10 bg-orange-500/[0.03]">
      <div className="mx-auto max-w-3xl">
        <FadeUp className="text-center">
          <div id="faq" className="scroll-mt-28">
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle>FREQUENTLY ASKED QUESTIONS</SectionTitle>
          </div>
        </FadeUp>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, i) => (
            <FadeUp key={faq.q} delay={i * 0.05}>
              <div className="glass-card overflow-hidden rounded-xl !p-0">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="pr-4 font-medium text-zinc-200">{faq.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-orange-400 transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/5 px-6 py-4 text-sm leading-relaxed text-zinc-400">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function FinalCTASection() {
  return (
    <Section id="consultation" className="relative overflow-hidden">
      <div className="aurora-bg absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-4xl text-center">
        <FadeUp>
          <SectionTitle>
            BUILD PORTFOLIO PROJECTS.
            <br />
            BUILD AI SYSTEMS.
            <br />
            <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
              BUILD YOUR FUTURE.
            </span>
          </SectionTitle>
          <SectionSubtitle className="mx-auto">
            Become job-ready in Agentic AI, Automation, and AI Engineering by
            building real systems that companies and clients actually need.
          </SectionSubtitle>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <GlowButton variant="primary" modalAction="enroll">
              Enroll in Cohort 1
            </GlowButton>
            <GlowButton variant="secondary" href={WHATSAPP_BOOKING_URL}>
              Book Free AI Career Consultation
            </GlowButton>
            <GlowButton variant="ghost" href={WHATSAPP_BOOKING_URL} className="gap-2">
              <WhatsAppIcon className="size-4 text-[#25D366]" />
              Talk on WhatsApp
            </GlowButton>
          </div>
        </FadeUp>
      </div>
    </Section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Rocket, Sparkles, Download, Calendar } from "lucide-react"
import { HERO_STATS } from "@/lib/landing-data"
import { WHATSAPP_BOOKING_URL } from "@/lib/whatsapp"
import { HeroParticles } from "@/components/landing/hero-particles"
import { GlowButton } from "@/components/landing/motion"
import { AnimatedShaderHero } from "@/components/ui/animated-shader-hero"

const headlineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 0.7,
      ease: "easeOut" as const,
    },
  }),
}

function useShaderIntensity(): "full" | "medium" | "low" {
  const [intensity, setIntensity] = useState<"full" | "medium" | "low">("full")

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setIntensity("low")
      else if (w < 1024) setIntensity("medium")
      else setIntensity("full")
    }
    update()
    window.addEventListener("resize", update, { passive: true })
    return () => window.removeEventListener("resize", update)
  }, [])

  return intensity
}

export function Hero() {
  const intensity = useShaderIntensity()

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-x-hidden bg-[#030303] pt-20 md:pt-24"
    >
      {/* Layer 1: Animated Shader Background */}
      <AnimatedShaderHero className="z-0" intensity={intensity} />

      {/* Layer 2: Warm gradient overlay (also in CSS on shader component) */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,#120600_0%,#1a0900_35%,#0d0500_70%,#040200_100%)] opacity-45 mix-blend-multiply" />

      {/* Layer 3: Floating particles + light streaks */}
      <div className="absolute inset-0 z-[2]">
        <HeroParticles />
      </div>

      {/* Layer 4: Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
        <div className="flex w-full max-w-3xl flex-col">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 inline-flex w-fit flex-col gap-1 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 sm:flex-row sm:items-center sm:gap-3 sm:px-5"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-orange-200">
              <Rocket className="size-4 text-orange-400" />
              Cohort Applications Now Open
            </span>
            <span className="hidden h-4 w-px bg-orange-500/30 sm:block" />
            <span className="flex items-center gap-1.5 text-xs text-orange-100/80 sm:text-sm">
              <Sparkles className="size-3.5 text-amber-300" />
              Trusted by Students, Professionals, Founders & Future AI Builders
            </span>
          </motion.div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 bg-[radial-gradient(ellipse_at_left,rgba(255,140,0,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute top-1/2 -left-4 h-24 w-24 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative space-y-1 md:space-y-2">
              <motion.h1
                custom={0}
                initial="hidden"
                animate="visible"
                variants={headlineVariants}
                className="hero-text-gold text-3xl leading-[1.08] font-bold tracking-tight md:text-5xl lg:text-6xl"
              >
                BUILD AI AGENTS.
              </motion.h1>
              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={headlineVariants}
                className="hero-text-orange text-3xl leading-[1.08] font-bold tracking-tight md:text-5xl lg:text-6xl"
              >
                AUTOMATE BUSINESSES.
              </motion.h1>
              <motion.h1
                custom={2}
                initial="hidden"
                animate="visible"
                variants={headlineVariants}
                className="hero-text-white-glow text-3xl leading-[1.08] font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                BECOME AN AGENTIC AI PROFESSIONAL.
              </motion.h1>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            Learn how to build AI Agents, Autonomous Workflows, Multi-Agent
            Systems, and AI Business Automations that companies are actively
            hiring for.
            <span className="mt-2 block text-zinc-300">
              Build real products, real portfolios, and real career opportunities
              in just one month.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {HERO_STATS.map((stat, i) => (
              <motion.span
                key={stat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 + i * 0.04 }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-sm md:text-sm"
              >
                {stat}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <GlowButton variant="primary" modalAction="enroll">
              Enroll in Cohort
            </GlowButton>
            <GlowButton variant="secondary" modalAction="brochure">
              <Download className="mr-2 size-4" />
              Download Brochure
            </GlowButton>
            <GlowButton variant="ghost" href={WHATSAPP_BOOKING_URL}>
              <Calendar className="mr-2 size-4" />
              Book Free AI Career Consultation
            </GlowButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

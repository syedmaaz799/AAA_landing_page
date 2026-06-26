"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { GRADUATION_BUILDS } from "@/lib/landing-data"
import { GlassCard } from "@/components/landing/motion"

const revealEase = [0.22, 1, 0.36, 1] as const

const cinematicReveal = (delay: number) => ({
  hidden: { opacity: 0, y: 80, scale: 0.95, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay, ease: revealEase },
  },
})

const GRADUATION_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  left: `${6 + ((i * 17) % 88)}%`,
  top: `${8 + ((i * 21) % 84)}%`,
  delay: `${i * 0.3}s`,
  duration: `${4 + (i % 3)}s`,
}))

function WordReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  text: string
  className?: string
  delay?: number
  as?: "h2" | "p"
}) {
  const words = text.split(" ")

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.7,
            delay: delay + index * 0.05,
            ease: revealEase,
          }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  )
}

export function GraduationSection() {
  return (
    <section className="graduation-section relative scroll-mt-28 overflow-hidden py-[140px]">
      <div
        className="graduation-hero-bg pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="graduation-hero-orb pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
      />
      <div
        className="graduation-hero-streak pointer-events-none absolute top-[22%] left-[12%] h-px w-1/4 -rotate-6 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"
        aria-hidden="true"
      />
      <div
        className="graduation-hero-streak pointer-events-none absolute right-[10%] bottom-[28%] h-px w-1/5 rotate-12 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {GRADUATION_PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="hero-particle absolute size-1 rounded-full bg-orange-400/35"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center px-8 text-center">
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={cinematicReveal(0.1)}
          className="graduation-badge mb-12 inline-flex items-center justify-center rounded-full border border-orange-500/[0.18] bg-orange-500/[0.08] px-7 py-3 text-xs font-semibold tracking-[0.22em] text-orange-300 uppercase backdrop-blur-[12px]"
        >
          By Graduation
        </motion.span>

        <motion.div
          className="graduation-headline-wrap flex w-full flex-col items-center justify-center gap-4 text-center md:gap-6"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <WordReveal
            text="NOT JUST A CERTIFICATE."
            className="graduation-headline-line text-white"
            delay={0.25}
          />
          <WordReveal
            text="A CAREER PORTFOLIO."
            className="graduation-headline-line graduation-headline-gradient"
            delay={0.45}
          />
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={cinematicReveal(0.65)}
          className="graduation-subtext mx-auto mt-10 mb-20 max-w-[850px]"
        >
          Build real assets, deploy production-ready AI systems, and graduate
          with a portfolio that demonstrates your skills to employers and
          clients.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.85 },
            },
          }}
          className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {GRADUATION_BUILDS.map((item) => (
            <motion.div
              key={item}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 80,
                  scale: 0.95,
                  filter: "blur(12px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.8, ease: revealEase },
                },
              }}
            >
              <GlassCard className="flex h-full items-center gap-3 text-left transition-transform duration-300 hover:-translate-y-1">
                <GraduationCap className="size-5 shrink-0 text-orange-400" />
                <span className="font-medium text-zinc-200">{item}</span>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

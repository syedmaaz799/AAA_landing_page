"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { GlowButton } from "@/components/landing/motion"

const revealEase = [0.22, 1, 0.36, 1] as const

const reveal = (delay: number) => ({
  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay, ease: revealEase },
  },
})

const PRICING_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + ((i * 19) % 84)}%`,
  top: `${10 + ((i * 23) % 80)}%`,
  delay: `${i * 0.25}s`,
  duration: `${3.5 + (i % 3)}s`,
}))

export function PricingSection() {
  return (
    <section className="relative overflow-hidden px-6 py-[100px]">
      <div className="pricing-hero-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pricing-hero-orb pointer-events-none absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/20 blur-[120px]" aria-hidden="true" />
      <div className="pricing-hero-streak pointer-events-none absolute top-[28%] left-1/4 h-px w-1/3 -rotate-6 bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" aria-hidden="true" />
      <div className="pricing-hero-streak pointer-events-none absolute bottom-[32%] right-1/4 h-px w-1/4 rotate-12 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PRICING_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="hero-particle absolute size-1 rounded-full bg-orange-400/40"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center text-center">
        <div id="pricing" className="scroll-mt-28">
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={reveal(0)}
            className="mb-6 inline-flex items-center rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-orange-300 uppercase"
          >
            Pricing
          </motion.span>

          <motion.div
            className="pricing-headline-wrap"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-0 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
            >
              <motion.h2 variants={reveal(0)} className="pricing-headline-line pricing-headline-shimmer">
                ONE MONTH.
              </motion.h2>
              <motion.h2 variants={reveal(0)} className="pricing-headline-line pricing-headline-shimmer">
                ONE DECISION.
              </motion.h2>
              <motion.h2 variants={reveal(0)} className="pricing-headline-line pricing-hero-shift">
                ONE CAREER SHIFT.
              </motion.h2>
            </motion.div>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={reveal(0.22)}
            className="pricing-hero-subtext mx-auto mt-6"
          >
            The next twelve months will pass either way. The only question is
            whether you spend them consuming AI or building with it.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={reveal(0.32)}
          className="mt-8 w-full max-w-md"
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3, ease: revealEase }}
            className="pricing-card gradient-border relative overflow-hidden rounded-[32px] border border-orange-500/20 p-8 text-center shadow-[0_0_60px_-12px_rgba(255,140,0,0.35)] backdrop-blur-[20px] md:p-10"
          >
            <p className="text-lg text-zinc-500 line-through md:text-xl">₹49,999</p>

            <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-6 py-5">
              <p className="text-5xl font-bold tracking-tight text-white md:text-6xl">
                ₹14,999
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-orange-500/25 bg-orange-500/[0.08] px-5 py-4 text-left">
              <p className="flex items-center gap-2 text-sm font-semibold text-orange-200">
                <Sparkles className="size-4 shrink-0 text-orange-400" />
                Not ready to decide? Attend a free 2-hour masterclass first.
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                Book any day within the next 14 days — 2:00 PM – 4:00 PM or
                5:00 PM – 7:00 PM. Experience the program, then enroll.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <GlowButton variant="primary" modalAction="enroll" className="w-full">
                Enroll in Cohort
              </GlowButton>
              <GlowButton variant="secondary" modalAction="enroll" className="w-full">
                Book Free Masterclass
              </GlowButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion, type Variants } from "framer-motion"
import { useLandingModalsOptional } from "@/components/modals/ModalProvider"
import { cn } from "@/lib/utils"

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-28 px-4 py-[120px] md:px-8 lg:px-12",
        className
      )}
    >
      {children}
    </section>
  )
}

export function FadeUp({
  className,
  children,
  delay = 0,
}: {
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px", amount: 0.15 }}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGrid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px", amount: 0.1 }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

export function GlassCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "glass-card gradient-border rounded-2xl p-6 transition-[border-color,transform] duration-300 hover:border-orange-500/40",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium tracking-wider text-orange-300 uppercase">
      {children}
    </span>
  )
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "max-w-4xl text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl",
        className
      )}
    >
      {children}
    </h2>
  )
}

export function SectionSubtitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg",
        className
      )}
    >
      {children}
    </p>
  )
}

export function GlowButton({
  variant = "primary",
  className,
  children,
  href,
  onClick,
  modalAction,
}: {
  variant?: "primary" | "secondary" | "ghost"
  className?: string
  children: React.ReactNode
  href?: string
  onClick?: () => void
  modalAction?: "brochure" | "enroll"
}) {
  const modals = useLandingModalsOptional()
  const base =
    "relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-[transform,opacity] duration-300 md:px-8 md:py-3.5 md:text-base"

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-amber-400 text-black shadow-[0_0_30px_-5px_rgba(255,140,0,0.5)] hover:scale-[1.02]",
    secondary:
      "border border-orange-500/30 bg-orange-500/10 text-orange-100 hover:border-orange-400/50 hover:bg-orange-500/20 hover:scale-[1.02]",
    ghost:
      "border border-white/10 bg-white/5 text-zinc-200 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02]",
  }

  const classes = cn(base, variants[variant], className)

  if (modalAction && modals) {
    return (
      <button
        type="button"
        className={classes}
        onClick={(event) => {
          onClick?.()
          if (modalAction === "brochure") {
            modals.openBrochure(event.currentTarget)
          } else {
            modals.openEnroll(event.currentTarget)
          }
        }}
      >
        {children}
      </button>
    )
  }

  if (href) {
    const isExternal = href.startsWith("http")
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

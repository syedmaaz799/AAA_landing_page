"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLenis } from "lenis/react"
import { Menu, X } from "lucide-react"
import { NAV_LINKS } from "@/lib/landing-data"
import { WHATSAPP_BOOKING_URL } from "@/lib/whatsapp"
import { GlowButton } from "@/components/landing/motion"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lenis = useLenis()

  useLenis(({ scroll }) => {
    setScrolled(scroll > 20)
  })

  useEffect(() => {
    if (!lenis) return
    if (mobileOpen) {
      lenis.stop()
      document.body.style.overflow = "hidden"
    } else {
      lenis.start()
      document.body.style.overflow = ""
    }
    return () => {
      lenis.start()
      document.body.style.overflow = ""
    }
  }, [mobileOpen, lenis])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 transform-gpu",
          scrolled
            ? "border-b border-white/10 bg-[#030303]/80 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <a href="#home" className="group flex items-center gap-2.5 md:gap-3">
            <img
              src="/brand/nv-logo-updated.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="size-9 shrink-0 object-contain md:size-10"
            />
            <div className="flex flex-col">
              <span className="font-brand text-lg font-bold tracking-tight text-white md:text-xl">
                NeuralVarsity
              </span>
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase md:text-xs">
                AI Agents & Automation
              </span>
            </div>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-orange-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <GlowButton variant="ghost" href={WHATSAPP_BOOKING_URL} className="!px-5 !py-2.5 !text-sm">
              Book Consultation
            </GlowButton>
            <GlowButton variant="primary" modalAction="enroll" className="!px-5 !py-2.5 !text-sm">
              Enroll Now
            </GlowButton>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg border border-white/10 p-2 text-zinc-300 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex h-full flex-col px-6 pt-24 pb-8"
            >
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-medium text-zinc-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <GlowButton variant="ghost" href={WHATSAPP_BOOKING_URL} onClick={() => setMobileOpen(false)}>
                  Book Consultation
                </GlowButton>
                <GlowButton
                  variant="primary"
                  modalAction="enroll"
                  onClick={() => setMobileOpen(false)}
                >
                  Enroll Now
                </GlowButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

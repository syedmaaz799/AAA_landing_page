"use client"

import { motion } from "framer-motion"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { WHATSAPP_BOOKING_URL } from "@/lib/whatsapp"

export function WhatsAppFloatButton() {
  return (
    <motion.a
      href={WHATSAPP_BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book AI Career Consultation on WhatsApp"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed right-6 bottom-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_28px_rgba(37,211,102,0.45)] transition-transform hover:scale-105 md:right-8 md:bottom-8"
    >
      <WhatsAppIcon className="size-7" />
    </motion.a>
  )
}

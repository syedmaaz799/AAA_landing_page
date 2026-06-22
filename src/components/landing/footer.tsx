"use client"

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import {
  WHATSAPP_BOOKING_URL,
  WHATSAPP_DISPLAY_NUMBER,
} from "@/lib/whatsapp"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <div className="flex items-center justify-center gap-2.5 md:justify-start md:gap-3">
            <img
              src="/brand/nv-logo-updated.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="size-9 shrink-0 object-contain md:size-10"
            />
            <p className="font-brand text-2xl font-bold tracking-tight text-white">
              NeuralVarsity
            </p>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            AI Agents & Automation Master Program
          </p>
          <p className="text-xs text-zinc-500">
            AI Agents & Automation Professional Certificate Program
          </p>
          <a
            href="https://neuralvarsity.ai"
            className="mt-3 inline-block text-sm text-sky-400 hover:text-sky-300"
          >
            neuralvarsity.ai
          </a>
        </div>

        <a
          href={WHATSAPP_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-zinc-200 transition-all hover:border-[#25D366]/40 hover:bg-[#25D366]/10 hover:text-white hover:shadow-[0_0_20px_-4px_rgba(37,211,102,0.35)]"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="size-5" />
          </span>
          <span className="text-left">
            <span className="block text-xs tracking-wide text-zinc-500 uppercase">
              WhatsApp
            </span>
            <span className="block text-sm font-medium text-white">
              {WHATSAPP_DISPLAY_NUMBER}
            </span>
          </span>
        </a>
      </div>

      <p className="mx-auto mt-12 max-w-7xl border-t border-white/5 pt-8 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} NeuralVarsity. All rights reserved.
      </p>
    </footer>
  )
}

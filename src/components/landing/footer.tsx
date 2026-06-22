"use client"

import { Code2, Globe, MessageCircle, Play, Share2 } from "lucide-react"

const SOCIALS = [
  { icon: Share2, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Globe, label: "Instagram", href: "https://instagram.com" },
  { icon: Play, label: "YouTube", href: "https://youtube.com" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/919999999999" },
  { icon: Code2, label: "GitHub", href: "https://github.com" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-2xl font-bold text-transparent">
            NeuralVarsity
          </p>
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

        <div className="flex gap-4">
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-sky-500/40 hover:text-sky-300 hover:shadow-[0_0_20px_-4px_rgba(63,169,255,0.4)]"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-7xl border-t border-white/5 pt-8 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} NeuralVarsity. All rights reserved.
      </p>
    </footer>
  )
}

"use client"

import { memo } from "react"
import {
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  Video,
} from "lucide-react"
import { MODAL_BENEFITS } from "@/lib/modal-form-data"
import { cn } from "@/lib/utils"

const benefitIcons = {
  "Industry Projects": BriefcaseBusiness,
  Certification: Award,
  "Placement Assistance": GraduationCap,
  "Live Sessions": Video,
} as const

type ModalSidebarProps = {
  className?: string
}

export const ModalSidebar = memo(function ModalSidebar({ className }: ModalSidebarProps) {
  return (
    <aside
      className={cn(
        "relative hidden overflow-hidden rounded-[24px] border border-sky-500/15 bg-gradient-to-br from-[#0a1230] via-[#061018] to-[#02040b] p-8 lg:flex lg:flex-col lg:justify-between",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(63,169,255,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-8 -bottom-8 size-40 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-sky-200 uppercase">
          <Sparkles className="size-3.5" />
          NeuralVarsity
        </div>

        <div className="mt-8 rounded-[20px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-lg font-bold text-black shadow-[0_0_30px_-8px_rgba(63,169,255,0.8)]">
            NV
          </div>
          <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">
            AI Agents & Automation
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Build production-ready AI agents, automation workflows, and career-ready
            portfolio projects in 4 weeks.
          </p>
        </div>
      </div>

      <ul className="relative mt-8 space-y-4">
        {MODAL_BENEFITS.map((benefit) => {
          const Icon = benefitIcons[benefit]
          return (
            <li key={benefit} className="flex items-center gap-3 text-sm text-zinc-200">
              <span className="flex size-9 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
                <Icon className="size-4" />
              </span>
              {benefit}
            </li>
          )
        })}
      </ul>
    </aside>
  )
})

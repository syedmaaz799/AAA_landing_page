"use client"

import { memo } from "react"
import {
  Award,
  BriefcaseBusiness,
  UsersRound,
  Video,
} from "lucide-react"
import { CURRICULUM } from "@/lib/landing-data"
import { MODAL_BENEFITS } from "@/lib/modal-form-data"
import { cn } from "@/lib/utils"

const benefitIcons = {
  "Industry Projects": BriefcaseBusiness,
  Certification: Award,
  "Expert Mentorship": UsersRound,
  "Live Sessions": Video,
} as const

const PROGRAM_STATS = [
  { value: "80+", label: "Hours" },
  { value: "10+", label: "Projects" },
  { value: "6", label: "Weeks" },
] as const

type ModalSidebarProps = {
  className?: string
}

export const ModalSidebar = memo(function ModalSidebar({ className }: ModalSidebarProps) {
  return (
    <aside
      className={cn(
        "relative hidden h-full min-h-0 flex-col overflow-hidden border-orange-500/15 bg-gradient-to-br from-[#1a0900] via-[#120600] to-[#040200] lg:flex",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,140,0,0.2),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-10 top-1/3 size-44 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="modal-scroll relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-6">
        <div className="shrink-0 rounded-[20px] border border-orange-500/20 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div
                className="pointer-events-none absolute -inset-2 rounded-full bg-orange-500/25 blur-lg"
                aria-hidden="true"
              />
              <img
                src="/brand/nv-logo-updated.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="relative size-12 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="font-brand text-lg font-bold leading-tight tracking-tight text-white">
                NeuralVarsity
              </p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.2em] text-orange-300/90 uppercase">
                AI Agents & Automation
              </p>
            </div>
          </div>

          <div
            className="my-4 h-px w-full bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"
            aria-hidden="true"
          />

          <p className="text-sm leading-relaxed text-zinc-300">
            Build production-ready AI agents, automation workflows, and
            portfolio projects in{" "}
            <span className="font-semibold text-orange-200">6 weeks</span>.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-orange-200">
              Cohort Open
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400">
              Live + Recorded
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {PROGRAM_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-orange-500/15 bg-orange-500/[0.05] px-2 py-2 text-center"
              >
                <p className="text-base font-bold leading-none text-white">{stat.value}</p>
                <p className="mt-1 text-[10px] font-medium text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-4 shrink-0 grid grid-cols-2 gap-2">
          {MODAL_BENEFITS.map((benefit) => {
            const Icon = benefitIcons[benefit]
            return (
              <li
                key={benefit}
                className="flex items-center gap-2 rounded-xl border border-orange-500/15 bg-orange-500/[0.06] px-2.5 py-2.5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-300">
                  <Icon className="size-3.5" />
                </span>
                <span className="text-[11px] font-medium leading-tight text-zinc-200">
                  {benefit}
                </span>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 shrink-0">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-orange-300/90 uppercase">
            6-Week Curriculum
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CURRICULUM.map((item) => (
              <div
                key={item.week}
                className="rounded-xl border border-white/[0.06] bg-black/25 px-2.5 py-2.5"
              >
                <p className="text-[9px] font-semibold tracking-wide text-orange-300/80 uppercase">
                  {item.week}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-zinc-200">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 shrink-0 rounded-[18px] border border-orange-500/25 bg-gradient-to-r from-orange-500/12 to-amber-500/8 px-4 py-3.5 text-center">
          <p className="text-xs text-zinc-500 line-through">₹49,999</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-white">₹14,999</p>
          <p className="mt-1 text-[10px] font-medium text-orange-300/90">
            Secure your seat in Cohort
          </p>
        </div>
      </div>
    </aside>
  )
})

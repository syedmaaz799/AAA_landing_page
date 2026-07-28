"use client"

import { memo, useMemo } from "react"
import { CalendarDays, Clock } from "lucide-react"
import {
  MASTERCLASS_BOOKING_WINDOW_DAYS,
  MASTERCLASS_SLOTS,
} from "@/lib/modal-form-data"
import { cn } from "@/lib/utils"

type BookingDay = {
  /** ISO date string (yyyy-mm-dd) used as the form value */
  iso: string
  weekday: string
  dayOfMonth: number
  month: string
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function buildBookingDays(): BookingDay[] {
  const days: BookingDay[] = []
  const today = new Date()

  for (let offset = 1; offset <= MASTERCLASS_BOOKING_WINDOW_DAYS; offset++) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)
    days.push({
      iso: toIsoDate(date),
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
      dayOfMonth: date.getDate(),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
    })
  }

  return days
}

type MasterclassSchedulerProps = {
  selectedDate: string
  selectedSlot: string
  onDateChange: (isoDate: string) => void
  onSlotChange: (slotId: string) => void
  dateError?: string
  slotError?: string
}

export const MasterclassScheduler = memo(function MasterclassScheduler({
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  dateError,
  slotError,
}: MasterclassSchedulerProps) {
  const days = useMemo(buildBookingDays, [])

  return (
    <div className="space-y-5 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-4 md:p-5">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-orange-200">
          <CalendarDays className="size-4" />
          Pick a day for your free masterclass
          <span className="text-orange-400">*</span>
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Slots available for the next {MASTERCLASS_BOOKING_WINDOW_DAYS} days.
        </p>

        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {days.map((day) => {
            const isSelected = day.iso === selectedDate
            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => onDateChange(day.iso)}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col items-center rounded-xl border px-1 py-2 transition-colors",
                  isSelected
                    ? "border-orange-500/70 bg-orange-500/20 shadow-[0_0_16px_-4px_rgba(255,140,0,0.6)]"
                    : "border-white/10 bg-white/[0.03] hover:border-orange-500/40 hover:bg-orange-500/10",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wide",
                    isSelected ? "text-orange-300" : "text-zinc-500",
                  )}
                >
                  {day.weekday}
                </span>
                <span
                  className={cn(
                    "text-base font-bold leading-tight",
                    isSelected ? "text-orange-100" : "text-zinc-200",
                  )}
                >
                  {day.dayOfMonth}
                </span>
                <span
                  className={cn(
                    "text-[10px]",
                    isSelected ? "text-orange-300" : "text-zinc-500",
                  )}
                >
                  {day.month}
                </span>
              </button>
            )
          })}
        </div>
        {dateError ? <p className="mt-2 text-xs text-red-400">{dateError}</p> : null}
      </div>

      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-orange-200">
          <Clock className="size-4" />
          Choose a time slot
          <span className="text-orange-400">*</span>
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MASTERCLASS_SLOTS.map((slot) => {
            const isSelected = slot.id === selectedSlot
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSlotChange(slot.id)}
                aria-pressed={isSelected}
                className={cn(
                  "flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors",
                  isSelected
                    ? "border-orange-500/70 bg-orange-500/20 text-orange-100 shadow-[0_0_16px_-4px_rgba(255,140,0,0.6)]"
                    : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-orange-500/40 hover:bg-orange-500/10",
                )}
              >
                <Clock
                  className={cn(
                    "size-4",
                    isSelected ? "text-orange-300" : "text-zinc-500",
                  )}
                />
                {slot.label}
              </button>
            )
          })}
        </div>
        {slotError ? <p className="mt-2 text-xs text-red-400">{slotError}</p> : null}
      </div>
    </div>
  )
})

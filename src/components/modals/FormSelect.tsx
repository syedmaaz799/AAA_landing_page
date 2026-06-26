"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"

type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  required?: boolean
  options: readonly string[] | { value: string; label: string }[]
  placeholder?: string
}

export const FormSelect = memo(function FormSelect({
  label,
  error,
  required,
  options,
  placeholder = "Select an option",
  className,
  id,
  ...props
}: FormSelectProps) {
  const selectId = id ?? props.name

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block text-sm font-medium text-zinc-200">
        {label}
        {required ? <span className="text-orange-400"> *</span> : null}
      </label>
      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={cn(
          "min-h-12 w-full appearance-none rounded-xl border bg-white/[0.04] px-4 text-sm text-white",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20",
          error ? "border-red-500/50" : "border-white/10",
          className,
        )}
        {...props}
      >
        <option value="" disabled className="bg-[#111] text-zinc-400">
          {placeholder}
        </option>
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option} className="bg-[#111]">
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value} className="bg-[#111]">
              {option.label}
            </option>
          ),
        )}
      </select>
      {error ? (
        <p id={`${selectId}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
})

"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  required?: boolean
}

export const FormInput = memo(function FormInput({
  label,
  error,
  required,
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id ?? props.name

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-200">
        {label}
        {required ? <span className="text-orange-400"> *</span> : null}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "min-h-12 w-full rounded-xl border bg-white/[0.04] px-4 text-sm text-white",
          "placeholder:text-zinc-500 transition-[border-color,box-shadow] duration-200",
          "focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20",
          error ? "border-red-500/50" : "border-white/10",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
})

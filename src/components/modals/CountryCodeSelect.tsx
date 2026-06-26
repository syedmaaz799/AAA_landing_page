"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { COUNTRY_CODES } from "@/lib/modal-form-data"

type CountryCodeSelectProps = {
  value: string
  onChange: (value: string) => void
  error?: string
}

export const CountryCodeSelect = memo(function CountryCodeSelect({
  value,
  onChange,
  error,
}: CountryCodeSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="countryCode" className="block text-sm font-medium text-zinc-200">
        Country Code<span className="text-orange-400"> *</span>
      </label>
      <select
        id="countryCode"
        name="countryCode"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-12 w-full appearance-none rounded-xl border bg-white/[0.04] px-3 text-sm text-white",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20",
          error ? "border-red-500/50" : "border-white/10",
        )}
      >
        {COUNTRY_CODES.map((code) => (
          <option key={code.value} value={code.value} className="bg-[#111]">
            {code.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  )
})

"use client"

import { memo, useCallback, useId, useState } from "react"
import { Loader2, Rocket } from "lucide-react"
import { Modal } from "@/components/modals/Modal"
import { ModalFormLayout } from "@/components/modals/ModalFormLayout"
import { FormInput } from "@/components/modals/FormInput"
import { FormSelect } from "@/components/modals/FormSelect"
import { CountryCodeSelect } from "@/components/modals/CountryCodeSelect"
import {
  EXPERIENCE_LEVELS,
  PROFESSIONS,
  QUALIFICATIONS,
} from "@/lib/modal-form-data"
import {
  validateEmail,
  validateName,
  validatePhone,
  validateRequired,
  validateTerms,
} from "@/lib/form-validation"
import type { EnrollLeadPayload } from "@/lib/supabase/leads"
import { cn } from "@/lib/utils"

type EnrollNowModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

type FormErrors = Partial<Record<keyof EnrollLeadPayload | "submit", string>>

const initialForm: EnrollLeadPayload = {
  fullName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  city: "",
  qualification: "",
  profession: "",
  experienceLevel: "",
  termsAccepted: false,
}

export const EnrollNowModal = memo(function EnrollNowModal({
  isOpen,
  onClose,
  onSuccess,
  returnFocusRef,
}: EnrollNowModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const [form, setForm] = useState<EnrollLeadPayload>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback(
    <K extends keyof EnrollLeadPayload>(key: K, value: EnrollLeadPayload[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => ({ ...prev, [key]: undefined, submit: undefined }))
    },
    [],
  )

  const validateForm = useCallback(() => {
    const nextErrors: FormErrors = {
      fullName: validateName(form.fullName) ?? undefined,
      email: validateEmail(form.email) ?? undefined,
      phone: validatePhone(form.phone) ?? undefined,
      city: validateRequired(form.city, "City") ?? undefined,
      qualification:
        validateRequired(form.qualification, "Highest qualification") ?? undefined,
      termsAccepted: validateTerms(form.termsAccepted) ?? undefined,
    }

    setErrors(nextErrors)
    return Object.values(nextErrors).every((value) => !value)
  }, [form])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = (await response.json()) as { ok?: boolean; message?: string }

      if (!response.ok || !data.ok) {
        setErrors({ submit: data.message ?? "Unable to submit. Please try again." })
        return
      }

      onSuccess("Enrollment request received. Our team will contact you shortly.")
      setForm(initialForm)
      onClose()

      const enrollmentUrl = process.env.NEXT_PUBLIC_ENROLLMENT_URL
      if (enrollmentUrl) {
        window.location.href = enrollmentUrl
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      returnFocusRef={returnFocusRef}
    >
      <ModalFormLayout
        titleId={titleId}
        descriptionId={descriptionId}
        title="Enroll Now"
        description="Secure your seat in Cohort 1 and start building real AI agents and automation systems."
        onClose={onClose}
        formId="enroll-form"
        onSubmit={handleSubmit}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              form="enroll-form"
              disabled={isSubmitting}
              className={cn(
                "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full",
                "bg-gradient-to-r from-sky-500 to-cyan-400 px-6 text-sm font-semibold text-black",
                "shadow-[0_0_30px_-5px_rgba(63,169,255,0.5)] transition-transform hover:scale-[1.01] disabled:opacity-60",
              )}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              Enroll Now
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            name="fullName"
            label="Full Name"
            required
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            error={errors.fullName}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          <FormInput
            name="email"
            type="email"
            label="Email Address"
            required
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={errors.email}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
          <CountryCodeSelect
            value={form.countryCode}
            onChange={(value) => updateField("countryCode", value)}
          />
          <FormInput
            name="phone"
            type="tel"
            label="Phone Number"
            required
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            error={errors.phone}
            placeholder="10-digit mobile number"
            autoComplete="tel-national"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            name="city"
            label="City"
            required
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
            error={errors.city}
            placeholder="Your city"
            autoComplete="address-level2"
          />
          <FormSelect
            name="qualification"
            label="Highest Qualification"
            required
            value={form.qualification}
            onChange={(event) => updateField("qualification", event.target.value)}
            error={errors.qualification}
            options={QUALIFICATIONS}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormSelect
            name="profession"
            label="Current Profession"
            value={form.profession}
            onChange={(event) => updateField("profession", event.target.value)}
            options={PROFESSIONS}
            placeholder="Select profession (optional)"
          />
          <FormSelect
            name="experienceLevel"
            label="Experience Level"
            value={form.experienceLevel}
            onChange={(event) => updateField("experienceLevel", event.target.value)}
            options={EXPERIENCE_LEVELS}
            placeholder="Select experience (optional)"
          />
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(event) => updateField("termsAccepted", event.target.checked)}
            className="mt-1 size-4 rounded border-white/20 bg-transparent text-sky-500 focus:ring-sky-500/30"
          />
          <span className="text-sm leading-relaxed text-zinc-300">
            I agree to the Terms & Conditions and consent to enrollment follow-up
            from NeuralVarsity.
            <span className="text-sky-400"> *</span>
          </span>
        </label>
        {errors.termsAccepted ? (
          <p className="text-xs text-red-400">{errors.termsAccepted}</p>
        ) : null}
        {errors.submit ? (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errors.submit}
          </p>
        ) : null}
      </ModalFormLayout>
    </Modal>
  )
})

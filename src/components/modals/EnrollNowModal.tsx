"use client"

import { memo, useCallback, useEffect, useId, useState } from "react"
import { GraduationCap, Loader2, Rocket, Sparkles } from "lucide-react"
import { Modal } from "@/components/modals/Modal"
import { ModalFormLayout } from "@/components/modals/ModalFormLayout"
import { FormInput } from "@/components/modals/FormInput"
import { FormSelect } from "@/components/modals/FormSelect"
import { CountryCodeSelect } from "@/components/modals/CountryCodeSelect"
import { MasterclassScheduler } from "@/components/modals/MasterclassScheduler"
import {
  EXPERIENCE_LEVELS,
  PROFESSIONS,
  QUALIFICATIONS,
  USER_ROLES,
} from "@/lib/modal-form-data"
import {
  validateEmail,
  validateName,
  validatePhone,
  validateRequired,
  validateTerms,
} from "@/lib/form-validation"
import {
  MASTERCLASS_COURSE_NAME,
  type EnrollLeadPayload,
  type RegistrationType,
} from "@/lib/leads"
import { getStoredLeadChannel } from "@/lib/lead-channel"
import { cn } from "@/lib/utils"

type EnrollNowModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

type FormErrors = Partial<Record<keyof EnrollLeadPayload | "submit", string>>

const initialForm: EnrollLeadPayload = {
  registrationType: "masterclass",
  fullName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  city: "",
  userRole: "",
  courseName: MASTERCLASS_COURSE_NAME,
  slotDate: "",
  slotTime: "",
  qualification: "",
  profession: "",
  experienceLevel: "",
  termsAccepted: false,
}

const REGISTRATION_PATHS: {
  type: RegistrationType
  title: string
  description: string
  icon: typeof Sparkles
  badge?: string
}[] = [
  {
    type: "masterclass",
    title: "Free 2-Hour Masterclass",
    description: "Attend a live masterclass first, then decide to join the program.",
    icon: Sparkles,
    badge: "Free",
  },
  {
    type: "direct",
    title: "Direct Enrollment",
    description: "Skip the masterclass and apply for the program directly.",
    icon: GraduationCap,
  },
]

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

  const isMasterclass = form.registrationType === "masterclass"

  useEffect(() => {
    if (!isOpen) return
    setForm(initialForm)
    setErrors({})
    setIsSubmitting(false)
  }, [isOpen])

  const updateField = useCallback(
    <K extends keyof EnrollLeadPayload>(key: K, value: EnrollLeadPayload[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => ({ ...prev, [key]: undefined, submit: undefined }))
    },
    [],
  )

  const selectPath = useCallback((type: RegistrationType) => {
    setForm((prev) => ({
      ...prev,
      registrationType: type,
      courseName: type === "masterclass" ? MASTERCLASS_COURSE_NAME : prev.courseName,
    }))
    setErrors((prev) => ({
      ...prev,
      slotDate: undefined,
      slotTime: undefined,
      userRole: undefined,
      qualification: undefined,
      experienceLevel: undefined,
      termsAccepted: undefined,
      submit: undefined,
    }))
  }, [])

  const validateForm = useCallback(() => {
    const nextErrors: FormErrors = {
      fullName: validateName(form.fullName) ?? undefined,
      email: validateEmail(form.email) ?? undefined,
      phone: validatePhone(form.phone) ?? undefined,
      city: validateRequired(form.city, "City") ?? undefined,
    }

    if (form.registrationType === "masterclass") {
      nextErrors.userRole =
        validateRequired(form.userRole, "User role") ?? undefined
      if (!form.slotDate) {
        nextErrors.slotDate = "Please pick a day for your masterclass."
      }
      if (!form.slotTime) {
        nextErrors.slotTime = "Please choose a time slot."
      }
    } else {
      nextErrors.qualification =
        validateRequired(form.qualification, "Highest qualification") ?? undefined
      nextErrors.termsAccepted = validateTerms(form.termsAccepted) ?? undefined
    }

    setErrors(nextErrors)
    return Object.values(nextErrors).every((value) => !value)
  }, [form])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const payload: EnrollLeadPayload =
        form.registrationType === "masterclass"
          ? {
              ...form,
              courseName: MASTERCLASS_COURSE_NAME,
              qualification: "",
              profession: "",
              experienceLevel: "",
              termsAccepted: false,
              leadChannel: getStoredLeadChannel(),
            }
          : {
              ...form,
              leadChannel: getStoredLeadChannel(),
            }

      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as { ok?: boolean; message?: string }

      if (!response.ok || !data.ok) {
        setErrors({ submit: data.message ?? "Unable to submit. Please try again." })
        return
      }

      onSuccess(
        form.registrationType === "masterclass"
          ? "Masterclass slot booked! Check your email for joining details."
          : "Enrollment request received. Our team will contact you shortly.",
      )
      setForm(initialForm)
      onClose()

      const enrollmentUrl = process.env.NEXT_PUBLIC_ENROLLMENT_URL
      if (form.registrationType === "direct" && enrollmentUrl) {
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
        title="Register Now"
        description="Book a free 2-hour masterclass or enroll directly in the AI Agents & Automation Master Program."
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
                "bg-gradient-to-r from-orange-500 to-amber-400 px-6 text-sm font-semibold text-black",
                "shadow-[0_0_30px_-5px_rgba(255,140,0,0.5)] transition-transform hover:scale-[1.01] disabled:opacity-60",
              )}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}
              {isMasterclass ? "Book Free Masterclass" : "Enroll Now"}
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
        <div className="grid gap-3 sm:grid-cols-2">
          {REGISTRATION_PATHS.map((path) => {
            const isSelected = form.registrationType === path.type
            const Icon = path.icon
            return (
              <button
                key={path.type}
                type="button"
                onClick={() => selectPath(path.type)}
                aria-pressed={isSelected}
                className={cn(
                  "relative flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-colors",
                  isSelected
                    ? "border-orange-500/70 bg-orange-500/15 shadow-[0_0_20px_-6px_rgba(255,140,0,0.6)]"
                    : "border-white/10 bg-white/[0.03] hover:border-orange-500/40 hover:bg-orange-500/[0.07]",
                )}
              >
                {path.badge ? (
                  <span className="absolute top-3 right-3 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                    {path.badge}
                  </span>
                ) : null}
                <span className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "size-4",
                      isSelected ? "text-orange-300" : "text-zinc-400",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isSelected ? "text-orange-100" : "text-zinc-200",
                    )}
                  >
                    {path.title}
                  </span>
                </span>
                <span className="text-xs leading-relaxed text-zinc-400">
                  {path.description}
                </span>
              </button>
            )
          })}
        </div>

        {isMasterclass ? (
          <MasterclassScheduler
            selectedDate={form.slotDate}
            selectedSlot={form.slotTime}
            onDateChange={(date) => updateField("slotDate", date)}
            onSlotChange={(slot) => updateField("slotTime", slot)}
            dateError={errors.slotDate}
            slotError={errors.slotTime}
          />
        ) : null}

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

        {isMasterclass ? (
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
              name="userRole"
              label="User Role"
              required
              value={form.userRole}
              onChange={(event) => updateField("userRole", event.target.value)}
              error={errors.userRole}
              options={USER_ROLES}
              placeholder="Select your role"
            />
          </div>
        ) : (
          <>
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
                label="Profession"
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
                onChange={(event) =>
                  updateField("termsAccepted", event.target.checked)
                }
                className="mt-1 size-4 rounded border-white/20 bg-transparent text-orange-500 focus:ring-orange-500/30"
              />
              <span className="text-sm leading-relaxed text-zinc-300">
                I agree to the Terms & Conditions and consent to enrollment
                follow-up from NeuralVarsity.
                <span className="text-orange-400"> *</span>
              </span>
            </label>
            {errors.termsAccepted ? (
              <p className="text-xs text-red-400">{errors.termsAccepted}</p>
            ) : null}
          </>
        )}

        {isMasterclass ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-zinc-400">
            Course:{" "}
            <span className="font-medium text-zinc-200">{MASTERCLASS_COURSE_NAME}</span>
          </p>
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

import { NextResponse } from "next/server"
import {
  MASTERCLASS_COURSE_NAME,
  type EnrollLeadPayload,
} from "@/lib/leads"
import {
  createAaaRegistration,
  createMasterclassRegistration,
  toNocoAaaRegistrationRecord,
  toNocoMasterclassRecord,
} from "@/lib/nocodb"
import {
  buildAaaRegistrationConfirmationEmail,
  buildMasterclassConfirmationEmail,
} from "@/lib/email-templates"
import { sendHtmlEmail } from "@/lib/gmail"

function missingMasterclassFields(body: EnrollLeadPayload): string[] {
  const missing: string[] = []
  if (!body.fullName?.trim()) missing.push("Full Name")
  if (!body.email?.trim()) missing.push("Email")
  if (!body.countryCode?.trim()) missing.push("Country Code")
  if (!body.phone?.trim()) missing.push("Phone Number")
  if (!body.city?.trim()) missing.push("City")
  if (!body.userRole?.trim()) missing.push("User Role")
  if (!body.slotDate?.trim()) missing.push("Masterclass Date")
  if (!body.slotTime?.trim()) missing.push("Time Slot")
  return missing
}

function missingDirectFields(body: EnrollLeadPayload): string[] {
  const missing: string[] = []
  if (!body.fullName?.trim()) missing.push("Full Name")
  if (!body.email?.trim()) missing.push("Email")
  if (!body.countryCode?.trim()) missing.push("Country Code")
  if (!body.phone?.trim()) missing.push("Phone Number")
  if (!body.city?.trim()) missing.push("City")
  if (!body.qualification?.trim()) missing.push("Highest Qualification")
  if (body.termsAccepted !== true) missing.push("Terms & Conditions")
  return missing
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnrollLeadPayload

    if (body.registrationType === "masterclass") {
      const normalized: EnrollLeadPayload = {
        ...body,
        courseName: body.courseName?.trim() || MASTERCLASS_COURSE_NAME,
      }

      const missing = missingMasterclassFields(normalized)
      if (missing.length > 0) {
        return NextResponse.json(
          { ok: false, message: `Please complete: ${missing.join(", ")}.` },
          { status: 400 },
        )
      }

      const result = await createMasterclassRegistration(
        toNocoMasterclassRecord(normalized),
      )

      if (!result.ok) {
        return NextResponse.json(
          { ok: false, message: result.message },
          { status: 502 },
        )
      }

      // Confirmation email is best-effort; registration already succeeded.
      const to = normalized.email.trim()
      const emailSent = await sendHtmlEmail({
        to,
        ...buildMasterclassConfirmationEmail({
          fullName: normalized.fullName.trim(),
          email: to,
          slotDate: normalized.slotDate.trim(),
          slotTime: normalized.slotTime.trim(),
        }),
      })
      if (!emailSent) {
        console.error(`[enroll] Confirmation email not sent to ${to}`)
      }

      return NextResponse.json({ ok: true })
    }

    if (body.registrationType === "direct") {
      const missing = missingDirectFields(body)
      if (missing.length > 0) {
        return NextResponse.json(
          { ok: false, message: `Please complete: ${missing.join(", ")}.` },
          { status: 400 },
        )
      }

      const result = await createAaaRegistration(
        toNocoAaaRegistrationRecord(body, "direct"),
      )

      if (!result.ok) {
        return NextResponse.json(
          { ok: false, message: result.message },
          { status: 502 },
        )
      }

      // Confirmation email is best-effort; registration already succeeded.
      const to = body.email.trim()
      const emailSent = await sendHtmlEmail({
        to,
        ...buildAaaRegistrationConfirmationEmail({
          fullName: body.fullName.trim(),
          email: to,
          countryCode: body.countryCode.trim(),
          phone: body.phone.trim(),
          city: body.city.trim(),
        }),
      })
      if (!emailSent) {
        console.error(`[enroll] Confirmation email not sent to ${to}`)
      }

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json(
      { ok: false, message: "Invalid registration type." },
      { status: 400 },
    )
  } catch (error) {
    console.error("[enroll] Unexpected error:", error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

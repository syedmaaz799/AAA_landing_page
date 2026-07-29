import { NextResponse } from "next/server"
import type { BrochureLeadPayload } from "@/lib/leads"
import {
  createAaaRegistration,
  toNocoAaaRegistrationRecord,
} from "@/lib/nocodb"

function missingBrochureFields(body: BrochureLeadPayload): string[] {
  const missing: string[] = []
  if (!body.fullName?.trim()) missing.push("Full Name")
  if (!body.email?.trim()) missing.push("Email")
  if (!body.countryCode?.trim()) missing.push("Country Code")
  if (!body.phone?.trim()) missing.push("Phone Number")
  if (!body.city?.trim()) missing.push("City / Location")
  if (!body.qualification?.trim()) missing.push("Highest Qualification")
  if (body.termsAccepted !== true) missing.push("Terms & Conditions")
  return missing
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BrochureLeadPayload

    const missing = missingBrochureFields(body)
    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, message: `Please complete: ${missing.join(", ")}.` },
        { status: 400 },
      )
    }

    const result = await createAaaRegistration(
      toNocoAaaRegistrationRecord(body, "brochure"),
    )

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[brochure] Unexpected error:", error)
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

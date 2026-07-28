import { NextResponse } from "next/server"
import type { BrochureLeadPayload } from "@/lib/leads"

function isValidPayload(body: BrochureLeadPayload) {
  return Boolean(
    body.fullName?.trim() &&
      body.email?.trim() &&
      body.countryCode?.trim() &&
      body.phone?.trim() &&
      body.city?.trim() &&
      body.qualification?.trim() &&
      body.termsAccepted === true,
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BrochureLeadPayload

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { ok: false, message: "Please complete all required fields." },
        { status: 400 },
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

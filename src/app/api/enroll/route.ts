import { NextResponse } from "next/server"
import { insertNocoDbRecord } from "@/lib/nocodb/client"
import type { EnrollLeadPayload } from "@/lib/supabase/leads"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnrollLeadPayload

    await insertNocoDbRecord({
      full_name: body.fullName,
      email: body.email,
      country_code: body.countryCode,
      phone: body.phone,
      city: body.city,
      qualification: body.qualification,
      profession: body.profession,
      "Experience-Level": body.experienceLevel,
      termsAccepted: body.termsAccepted,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[enroll] NocoDB insert failed:", error)
    return NextResponse.json(
      { ok: false, message: "Unable to save your enrollment. Please try again." },
      { status: 500 },
    )
  }
}

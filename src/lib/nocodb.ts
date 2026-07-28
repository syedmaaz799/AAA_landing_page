import { getServerEnv } from "@/lib/env"
import type { EnrollLeadPayload } from "@/lib/leads"
import { MASTERCLASS_SLOTS } from "@/lib/modal-form-data"

/** NocoDB `Masterclass` table row (exact column names). */
export type NocoMasterclassRecord = {
  full_name: string
  email: string
  phone_number: string
  country_code: string
  city: string
  user_role: string
  course_name: string
  slot_date: string
  slot_time: string
}

/** NocoDB `AAA_registration` table row (exact column names). */
export type NocoAaaRegistrationRecord = {
  full_name: string
  email: string
  country_code: string
  phone: string
  city: string
  qualification: string
  profession: string
  experience_level: string
  termsAccepted: boolean
}

function slotLabel(slotId: string): string {
  const match = MASTERCLASS_SLOTS.find((slot) => slot.id === slotId)
  return match?.label ?? slotId
}

export function toNocoMasterclassRecord(
  body: EnrollLeadPayload,
): NocoMasterclassRecord {
  return {
    full_name: body.fullName.trim(),
    email: body.email.trim(),
    phone_number: body.phone.trim(),
    country_code: body.countryCode.trim(),
    city: body.city.trim(),
    user_role: body.userRole.trim(),
    course_name: body.courseName.trim(),
    slot_date: body.slotDate.trim(),
    slot_time: slotLabel(body.slotTime.trim()),
  }
}

export function toNocoAaaRegistrationRecord(
  body: EnrollLeadPayload,
): NocoAaaRegistrationRecord {
  return {
    full_name: body.fullName.trim(),
    email: body.email.trim(),
    country_code: body.countryCode.trim(),
    phone: body.phone.trim(),
    city: body.city.trim(),
    qualification: body.qualification.trim(),
    profession: body.profession.trim(),
    experience_level: body.experienceLevel.trim(),
    termsAccepted: body.termsAccepted === true,
  }
}

async function insertNocoRecord(
  tableId: string,
  record: Record<string, unknown>,
  label: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const env = getServerEnv()
  const url = `${env.nocodbBaseUrl}/api/v2/tables/${tableId}/records`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xc-token": env.nocodbApiToken,
    },
    body: JSON.stringify(record),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    console.error(
      `[nocodb] ${label} insert failed:`,
      response.status,
      detail.slice(0, 500),
    )
    return {
      ok: false,
      message: `Unable to save your ${label.toLowerCase()}. Please try again.`,
    }
  }

  return { ok: true }
}

export async function createMasterclassRegistration(
  record: NocoMasterclassRecord,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const env = getServerEnv()
  return insertNocoRecord(
    env.nocodbRegistrationsTableId,
    record,
    "Masterclass booking",
  )
}

export async function createAaaRegistration(
  record: NocoAaaRegistrationRecord,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const env = getServerEnv()
  return insertNocoRecord(
    env.nocodbAaaRegistrationTableId,
    record,
    "Enrollment",
  )
}

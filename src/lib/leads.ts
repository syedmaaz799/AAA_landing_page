export type BrochureLeadPayload = {
  fullName: string
  email: string
  countryCode: string
  phone: string
  city: string
  qualification: string
  profession: string
  experienceLevel: string
  termsAccepted: boolean
}

export type RegistrationType = "masterclass" | "direct"

/**
 * Enroll / register payload.
 * Masterclass fields map to NocoDB `Masterclass` table:
 * full_name, email, phone_number, country_code, city,
 * user_role, course_name, slot_date, slot_time
 */
export type EnrollLeadPayload = {
  registrationType: RegistrationType
  fullName: string
  email: string
  countryCode: string
  phone: string
  city: string
  /** Maps to NocoDB `user_role` (masterclass) */
  userRole: string
  /** Maps to NocoDB `course_name` (auto-filled for masterclass) */
  courseName: string
  /** Maps to NocoDB `slot_date` */
  slotDate: string
  /** Maps to NocoDB `slot_time` */
  slotTime: string
  /** Direct enrollment only — maps to AAA_registration */
  qualification: string
  profession: string
  experienceLevel: string
  termsAccepted: boolean
}

export const MASTERCLASS_COURSE_NAME = "AI Agents & Automation Master Program"

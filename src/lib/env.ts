/**
 * Server env validation for NeuralVarsity masterclass / NocoDB integration.
 * Client-safe vars are prefixed NEXT_PUBLIC_. NocoDB secrets stay server-only.
 */

function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return trimmed
}

export type ServerEnv = {
  nocodbBaseUrl: string
  nocodbApiToken: string
  nocodbRegistrationsTableId: string
  nocodbAaaRegistrationTableId: string
  nocodbSurveyTableId: string
}

let cached: ServerEnv | null = null

/** Lazy-validated server env (throws if NocoDB secrets are missing). */
export function getServerEnv(): ServerEnv {
  if (cached) return cached

  cached = {
    nocodbBaseUrl: required("NOCODB_BASE_URL", process.env.NOCODB_BASE_URL).replace(
      /\/$/,
      "",
    ),
    nocodbApiToken: required("NOCODB_API_TOKEN", process.env.NOCODB_API_TOKEN),
    nocodbRegistrationsTableId: required(
      "NOCODB_REGISTRATIONS_TABLE_ID",
      process.env.NOCODB_REGISTRATIONS_TABLE_ID,
    ),
    nocodbAaaRegistrationTableId: required(
      "NOCODB_AAA_REGISTRATION_TABLE_ID",
      process.env.NOCODB_AAA_REGISTRATION_TABLE_ID,
    ),
    nocodbSurveyTableId: required(
      "NOCODB_SURVEY_TABLE_ID",
      process.env.NOCODB_SURVEY_TABLE_ID,
    ),
  }

  return cached
}

export type GmailEnv = {
  clientId: string
  clientSecret: string
  refreshToken: string
  senderEmail: string
  senderName: string
}

/**
 * Gmail OAuth env for sending confirmation emails.
 * Returns null when not configured so registration keeps working without email.
 * Deliberately not cached: dev env reloads must be picked up immediately.
 */
export function getGmailEnv(): GmailEnv | null {
  const clientId = process.env.GMAIL_CLIENT_ID?.trim()
  const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim()
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN?.trim()
  const senderEmail = process.env.GMAIL_SENDER_EMAIL?.trim()

  if (!clientId || !clientSecret || !refreshToken || !senderEmail) {
    return null
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    senderEmail,
    senderName:
      process.env.GMAIL_SENDER_NAME?.trim() || "NeuralVarsity Admissions",
  }
}

export function getPublicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:3001"
  )
}

export function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"
}

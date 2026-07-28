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

export function getPublicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:3001"
  )
}

export function isAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"
}

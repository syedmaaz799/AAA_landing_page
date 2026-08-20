/** Marketing / acquisition channel for a lead (separate from form `source`). */
export type LeadChannel =
  | "Pamphlet"
  | "Auto Rickshaw"
  | "Influencer Story / Post"
  | "Website"

const STORAGE_KEY = "nv_lead_channel"

const CHANNEL_ALIASES: Record<string, LeadChannel> = {
  pamphlet: "Pamphlet",
  pamphlets: "Pamphlet",
  "auto-rickshaw": "Auto Rickshaw",
  autorickshaw: "Auto Rickshaw",
  "auto rickshaw": "Auto Rickshaw",
  auto: "Auto Rickshaw",
  rickshaw: "Auto Rickshaw",
  "influencer story / post": "Influencer Story / Post",
  "influencer-story-post": "Influencer Story / Post",
  "influencer story post": "Influencer Story / Post",
  influencer: "Influencer Story / Post",
  "influencer-story": "Influencer Story / Post",
  "influencer post": "Influencer Story / Post",
  "influencer-post": "Influencer Story / Post",
  website: "Website",
}

export function normalizeLeadChannel(value: unknown): LeadChannel {
  if (typeof value !== "string") return "Website"
  const normalized = value.trim().toLowerCase().replaceAll("_", " ")
  return CHANNEL_ALIASES[normalized] ?? CHANNEL_ALIASES[normalized.replaceAll(" ", "-")] ?? "Website"
}

/** Persist acquisition channel from a URL query value. */
export function captureLeadChannelFromSearch(search: string): LeadChannel | null {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`)
  const raw =
    params.get("source") ??
    params.get("lead_channel") ??
    params.get("utm_source") ??
    params.get("channel")

  if (!raw) return null

  const channel = normalizeLeadChannel(raw)
  if (channel !== "Website") {
    window.sessionStorage.setItem(STORAGE_KEY, channel)
  }
  return channel
}

/** Read the channel stored for this browser session (defaults to Website). */
export function getStoredLeadChannel(): LeadChannel {
  if (typeof window === "undefined") return "Website"
  return normalizeLeadChannel(window.sessionStorage.getItem(STORAGE_KEY))
}

type FbqFunction = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[]
  loaded?: boolean
  version?: string
  push: FbqFunction
}

declare global {
  interface Window {
    fbq?: FbqFunction
    _fbq?: FbqFunction
  }
}

/** Fire a standard Meta Pixel event (no-op if pixel is not loaded). */
export function trackMetaEvent(
  event: "Lead" | "CompleteRegistration" | "Schedule" | "PageView",
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return
  if (params) {
    window.fbq("track", event, params)
  } else {
    window.fbq("track", event)
  }
}

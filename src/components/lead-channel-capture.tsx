"use client"

import { useEffect } from "react"
import { captureLeadChannelFromSearch } from "@/lib/lead-channel"

/**
 * Captures ?source=pamphlet (and aliases) into sessionStorage so enroll /
 * brochure forms can tag NocoDB lead_channel as "Pamphlet".
 */
export function LeadChannelCapture() {
  useEffect(() => {
    captureLeadChannelFromSearch(window.location.search)
  }, [])

  return null
}

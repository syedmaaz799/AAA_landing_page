import { getGmailEnv } from "@/lib/env"

type SendHtmlEmailInput = {
  to: string
  subject: string
  html: string
}

async function getAccessToken(): Promise<string | null> {
  const env = getGmailEnv()
  if (!env) return null

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.clientId,
      client_secret: env.clientSecret,
      refresh_token: env.refreshToken,
      grant_type: "refresh_token",
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    console.error(
      "[gmail] Token refresh failed:",
      response.status,
      detail.slice(0, 500),
    )
    return null
  }

  const data = (await response.json()) as { access_token?: string }
  return data.access_token ?? null
}

/**
 * Sends an HTML email via the Gmail API as the configured sender.
 * Never throws — returns false and logs on any failure, so callers
 * (e.g. registration APIs) are not blocked by email issues.
 */
export async function sendHtmlEmail({
  to,
  subject,
  html,
}: SendHtmlEmailInput): Promise<boolean> {
  const env = getGmailEnv()
  if (!env) {
    console.warn("[gmail] Skipping email: GMAIL_* env vars are not configured.")
    return false
  }

  try {
    const accessToken = await getAccessToken()
    if (!accessToken) return false

    // Subject is RFC 2047 encoded so emoji/non-ASCII render correctly.
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`

    const mime = [
      `From: ${env.senderName} <${env.senderEmail}>`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(html, "utf-8").toString("base64"),
    ].join("\r\n")

    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: Buffer.from(mime, "utf-8").toString("base64url"),
        }),
      },
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.error(
        "[gmail] Send failed:",
        response.status,
        detail.slice(0, 500),
      )
      return false
    }

    return true
  } catch (error) {
    console.error("[gmail] Unexpected send error:", error)
    return false
  }
}

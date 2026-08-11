import { MASTERCLASS_SLOTS } from "@/lib/modal-form-data"

type MasterclassConfirmationInput = {
  fullName: string
  email: string
  /** ISO date (yyyy-mm-dd) from the scheduler */
  slotDate: string
  /** Slot id, e.g. "2pm-4pm" */
  slotTime: string
}

/** Slot id → UTC start/end for Google Calendar links (IST = UTC+5:30). */
const SLOT_UTC_TIMES: Record<string, { start: string; end: string }> = {
  "2pm-4pm": { start: "083000", end: "103000" },
  "5pm-7pm": { start: "113000", end: "133000" },
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function slotLabel(slotId: string): string {
  return MASTERCLASS_SLOTS.find((slot) => slot.id === slotId)?.label ?? slotId
}

function formatSessionDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

function buildCalendarUrl(isoDate: string, slotId: string): string {
  const times = SLOT_UTC_TIMES[slotId]
  const ymd = isoDate.replaceAll("-", "")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "NeuralVarsity Agentic AI Masterclass",
    details:
      "Live on Zoom. Your joining link arrives by email and WhatsApp before the session.",
  })
  if (times) {
    params.set("dates", `${ymd}T${times.start}Z/${ymd}T${times.end}Z`)
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildMasterclassConfirmationEmail(
  input: MasterclassConfirmationInput,
): { subject: string; html: string } {
  const name = escapeHtml(input.fullName)
  const email = escapeHtml(input.email)
  const sessionDate = formatSessionDate(input.slotDate)
  const sessionTime = slotLabel(input.slotTime)
  const session = `${sessionDate} · ${sessionTime} IST`
  const calendarUrl = buildCalendarUrl(input.slotDate, input.slotTime)

  const subject = "🎉 You're in! Your NeuralVarsity AI Masterclass seat is confirmed"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>NeuralVarsity Registration Confirmed</title>
<style>
  @media only screen and (max-width:480px){
    .stack{display:block !important;width:100% !important;box-sizing:border-box;}
    .h1{font-size:30px !important;}
    .pad{padding:24px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<!-- Preheader (hidden inbox preview line) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  Seat confirmed &#10003; ${session} on Zoom.
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:40px 0;">
<tr><td align="center">

<!-- Header -->
<table role="presentation" width="650" cellspacing="0" cellpadding="0" style="max-width:650px;width:100%;background:#0A0E1A;border-radius:18px 18px 0 0;">
<tr><td align="center" class="pad" style="padding:32px;">
<img src="https://res.cloudinary.com/dy6bvdxau/image/upload/NVLOGO_snotsy" width="56" alt="NeuralVarsity logo" style="display:block;margin:0 auto;">
<div style="color:#ffffff;font-size:26px;font-weight:bold;padding-top:12px;">NeuralVarsity</div>
<div style="margin-top:24px;display:inline-block;background:#123b38;color:#7ef2e4;padding:8px 18px;border-radius:999px;font-size:12px;font-weight:bold;letter-spacing:1px;">
REGISTRATION CONFIRMED
</div>
<h1 class="h1" style="margin:22px 0 12px;color:#ffffff;font-size:38px;line-height:1.15;">&#127881; You're officially in!</h1>
<p style="margin:0;color:#c7d2e0;font-size:17px;line-height:1.6;">
Hi ${name}, your seat for the <strong style="color:#ffffff;">Agentic AI Masterclass</strong> is confirmed.
</p>
</td></tr>
</table>

<!-- Body -->
<table role="presentation" width="650" cellspacing="0" cellpadding="0" style="max-width:650px;width:100%;background:#ffffff;">
<tr><td class="pad" style="padding:36px;">

<!-- Details -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="12" style="border:1px solid #e8edf5;border-radius:12px;">
<tr><td colspan="2" style="font-size:20px;font-weight:bold;color:#0A0E1A;">Registration Details</td></tr>
<tr><td style="color:#667085;width:38%;">Name</td><td style="color:#0A0E1A;"><strong>${name}</strong></td></tr>
<tr><td style="color:#667085;">Email</td><td style="color:#0A0E1A;">${email}</td></tr>
<tr><td style="color:#667085;">Session</td><td style="color:#0A0E1A;"><strong>${session}</strong> · Live on Zoom</td></tr>
<tr><td style="color:#667085;">Status</td><td style="color:#0aa37f;font-weight:bold;">Confirmed &#10003;</td></tr>
</table>

<!-- Add to calendar -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center" style="padding:22px 0 6px;">
<a href="${calendarUrl}"
   style="display:inline-block;border:2px solid #00A89B;color:#00847a;text-decoration:none;padding:12px 26px;border-radius:10px;font-weight:bold;font-size:14px;">
&#128197; Add to Google Calendar
</a>
</td>
</tr>
</table>

<h2 style="margin:36px 0 14px;color:#0A0E1A;font-size:22px;">What happens next?</h2>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td class="stack" width="33%" valign="top" style="padding:8px;">
<div style="border:1px solid #e7edf6;border-radius:12px;padding:18px;">
<div style="font-size:24px;">&#128172;</div>
<h3 style="margin:8px 0 6px;color:#0A0E1A;font-size:16px;">Join WhatsApp</h3>
<p style="margin:0;color:#667085;font-size:14px;line-height:1.6;">Reminders, resources, and announcements land in our official community.</p>
</div>
</td>

<td class="stack" width="33%" valign="top" style="padding:8px;">
<div style="border:1px solid #e7edf6;border-radius:12px;padding:18px;">
<div style="font-size:24px;">&#128197;</div>
<h3 style="margin:8px 0 6px;color:#0A0E1A;font-size:16px;">Get Your Zoom Link</h3>
<p style="margin:0;color:#667085;font-size:14px;line-height:1.6;">Your joining link arrives by email and WhatsApp before the session.</p>
</div>
</td>

<td class="stack" width="33%" valign="top" style="padding:8px;">
<div style="border:1px solid #e7edf6;border-radius:12px;padding:18px;">
<div style="font-size:24px;">&#129302;</div>
<h3 style="margin:8px 0 6px;color:#0A0E1A;font-size:16px;">Build Live</h3>
<p style="margin:0;color:#667085;font-size:14px;line-height:1.6;">Create working AI agents hands-on during the live session.</p>
</div>
</td>
</tr>
</table>

<h2 style="margin:38px 0 14px;color:#0A0E1A;font-size:22px;">You'll build</h2>

<ul style="margin:0;padding-left:20px;color:#344054;line-height:2;font-size:15px;">
<li>AI Chatbots with OpenAI, Gemini &amp; Groq</li>
<li>Autonomous AI Agents</li>
<li>WhatsApp AI Automations</li>
<li>Local AI Systems</li>
<li>Real-world AI Workflows</li>
</ul>

<!-- WhatsApp CTA -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:34px 0;background:#0A0E1A;border-radius:16px;">
<tr>
<td align="center" style="padding:30px;">
<h2 style="margin:0;color:#ffffff;font-size:22px;">Join the WhatsApp Community</h2>
<p style="margin:10px 0 18px;color:#d0d8e4;line-height:1.7;font-size:15px;">
Zoom links, reminders, and session resources are shared there first.
</p>

<a href="https://chat.whatsapp.com/KrBJwbSNmxSLRg863Outkm"
   style="display:inline-block;background:#00A89B;color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:10px;font-weight:bold;font-size:15px;">
Join WhatsApp Community
</a>

</td>
</tr>
</table>

<div style="background:#F7FAFC;border-left:4px solid #00A89B;padding:18px;border-radius:8px;color:#344054;font-size:14px;line-height:1.7;">
<strong>Need help?</strong><br>
Reply to this email or write to <b>admissions@neuralvarsity.ai</b>.
</div>

<p style="margin:32px 0 0;color:#475467;line-height:1.8;font-size:15px;">
We can't wait to build with you at the masterclass.
</p>

<p style="margin:26px 0 0;color:#0A0E1A;font-size:15px;">
<b>Team NeuralVarsity</b><br>
<span style="color:#667085;">Modern AI Education</span>
</p>

</td></tr>
</table>

<!-- Footer -->
<table role="presentation" width="650" cellspacing="0" cellpadding="0" style="max-width:650px;width:100%;background:#0A0E1A;border-radius:0 0 18px 18px;">
<tr>
<td align="center" style="padding:26px;color:#9fb0c4;font-size:13px;">
&copy; 2026 NeuralVarsity &middot; neuralvarsity.ai
</td>
</tr>
</table>

</td></tr>
</table>

</body>
</html>`

  return { subject, html }
}

type AaaRegistrationConfirmationInput = {
  fullName: string
  email: string
  countryCode: string
  phone: string
  city: string
}

const AAA_WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/JXvxflVAbuI6FQ4ohoO3f6"

export function buildAaaRegistrationConfirmationEmail(
  input: AaaRegistrationConfirmationInput,
): { subject: string; html: string } {
  const name = escapeHtml(input.fullName)
  const email = escapeHtml(input.email)
  const phone = escapeHtml(`${input.countryCode} ${input.phone}`)
  const city = escapeHtml(input.city)

  const subject =
    "🚀 Welcome aboard! Your AI Agents & Automation registration is received"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>NeuralVarsity Program Registration Received</title>
<style>
  @media only screen and (max-width:480px){
    .stack{display:block !important;width:100% !important;box-sizing:border-box;}
    .h1{font-size:30px !important;}
    .pad{padding:24px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#fbf6f0;font-family:Arial,Helvetica,sans-serif;">

<!-- Preheader (hidden inbox preview line) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  Registration received &#10003; Our admissions team will contact you shortly to complete your enrollment.
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf6f0;padding:40px 0;">
<tr><td align="center">

<!-- Header -->
<table role="presentation" width="650" cellspacing="0" cellpadding="0" style="max-width:650px;width:100%;background:#150800;border-radius:18px 18px 0 0;">
<tr><td align="center" class="pad" style="padding:32px;">
<img src="https://res.cloudinary.com/dy6bvdxau/image/upload/NVLOGO_snotsy" width="56" alt="NeuralVarsity logo" style="display:block;margin:0 auto;">
<div style="color:#ffffff;font-size:26px;font-weight:bold;padding-top:12px;">NeuralVarsity</div>
<div style="margin-top:24px;display:inline-block;background:#3b2004;color:#ffc37e;padding:8px 18px;border-radius:999px;font-size:12px;font-weight:bold;letter-spacing:1px;">
REGISTRATION RECEIVED
</div>
<h1 class="h1" style="margin:22px 0 12px;color:#ffffff;font-size:38px;line-height:1.15;">&#128640; Welcome aboard!</h1>
<p style="margin:0;color:#e8d5c4;font-size:17px;line-height:1.6;">
Hi ${name}, your registration for the <strong style="color:#ffffff;">AI Agents &amp; Automation Master Program</strong> has been received.
</p>
</td></tr>
</table>

<!-- Body -->
<table role="presentation" width="650" cellspacing="0" cellpadding="0" style="max-width:650px;width:100%;background:#ffffff;">
<tr><td class="pad" style="padding:36px;">

<!-- Details -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="12" style="border:1px solid #f3e3d3;border-radius:12px;">
<tr><td colspan="2" style="font-size:20px;font-weight:bold;color:#150800;">Registration Details</td></tr>
<tr><td style="color:#8a7364;width:38%;">Name</td><td style="color:#150800;"><strong>${name}</strong></td></tr>
<tr><td style="color:#8a7364;">Email</td><td style="color:#150800;">${email}</td></tr>
<tr><td style="color:#8a7364;">Phone</td><td style="color:#150800;">${phone}</td></tr>
<tr><td style="color:#8a7364;">City</td><td style="color:#150800;">${city}</td></tr>
<tr><td style="color:#8a7364;">Program</td><td style="color:#150800;"><strong>AI Agents &amp; Automation Master Program</strong> &middot; 4 weeks &middot; Live cohort</td></tr>
<tr><td style="color:#8a7364;">Status</td><td style="color:#ea7014;font-weight:bold;">Received &#10003;</td></tr>
</table>

<h2 style="margin:36px 0 14px;color:#150800;font-size:22px;">What happens next?</h2>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td class="stack" width="33%" valign="top" style="padding:8px;">
<div style="border:1px solid #f3e3d3;border-radius:12px;padding:18px;">
<div style="font-size:24px;">&#128222;</div>
<h3 style="margin:8px 0 6px;color:#150800;font-size:16px;">Admissions Call</h3>
<p style="margin:0;color:#8a7364;font-size:14px;line-height:1.6;">Our admissions team will reach out shortly to complete your enrollment and answer your questions.</p>
</div>
</td>

<td class="stack" width="33%" valign="top" style="padding:8px;">
<div style="border:1px solid #f3e3d3;border-radius:12px;padding:18px;">
<div style="font-size:24px;">&#128172;</div>
<h3 style="margin:8px 0 6px;color:#150800;font-size:16px;">Join the Community</h3>
<p style="margin:0;color:#8a7364;font-size:14px;line-height:1.6;">Cohort updates, resources, and announcements land in our official WhatsApp community.</p>
</div>
</td>

<td class="stack" width="33%" valign="top" style="padding:8px;">
<div style="border:1px solid #f3e3d3;border-radius:12px;padding:18px;">
<div style="font-size:24px;">&#129302;</div>
<h3 style="margin:8px 0 6px;color:#150800;font-size:16px;">Start Building</h3>
<p style="margin:0;color:#8a7364;font-size:14px;line-height:1.6;">Get ready for 4 weeks of hands-on sessions building real AI agents and automations.</p>
</div>
</td>
</tr>
</table>

<h2 style="margin:38px 0 14px;color:#150800;font-size:22px;">Your program includes</h2>

<ul style="margin:0;padding-left:20px;color:#4a3a2e;line-height:2;font-size:15px;">
<li>80+ hours of live, hands-on training</li>
<li>10+ industry projects for your portfolio</li>
<li>AI agents, automation workflows &amp; production-ready systems</li>
<li>Expert mentorship throughout the cohort</li>
<li>Certification on completion</li>
</ul>

<!-- WhatsApp CTA -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:34px 0;background:#150800;border-radius:16px;">
<tr>
<td align="center" style="padding:30px;">
<h2 style="margin:0;color:#ffffff;font-size:22px;">Join the Program Community</h2>
<p style="margin:10px 0 18px;color:#e8d5c4;line-height:1.7;font-size:15px;">
Cohort announcements, resources, and updates are shared there first.
</p>

<a href="${AAA_WHATSAPP_COMMUNITY_URL}"
   style="display:inline-block;background:#ea7014;color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:10px;font-weight:bold;font-size:15px;">
Join WhatsApp Community
</a>

</td>
</tr>
</table>

<div style="background:#fdf8f3;border-left:4px solid #ea7014;padding:18px;border-radius:8px;color:#4a3a2e;font-size:14px;line-height:1.7;">
<strong>Need help?</strong><br>
Reply to this email or write to <b>admissions@neuralvarsity.ai</b>.
</div>

<p style="margin:32px 0 0;color:#6b5545;line-height:1.8;font-size:15px;">
We can't wait to build with you in the cohort.
</p>

<p style="margin:26px 0 0;color:#150800;font-size:15px;">
<b>Team NeuralVarsity</b><br>
<span style="color:#8a7364;">Modern AI Education</span>
</p>

</td></tr>
</table>

<!-- Footer -->
<table role="presentation" width="650" cellspacing="0" cellpadding="0" style="max-width:650px;width:100%;background:#150800;border-radius:0 0 18px 18px;">
<tr>
<td align="center" style="padding:26px;color:#c4a893;font-size:13px;">
&copy; 2026 NeuralVarsity &middot; neuralvarsity.ai
</td>
</tr>
</table>

</td></tr>
</table>

</body>
</html>`

  return { subject, html }
}

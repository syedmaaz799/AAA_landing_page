export const COUNTRY_CODES = [
  { value: "+91", label: "🇮🇳 +91 India" },
  { value: "+1", label: "🇺🇸 +1 United States" },
  { value: "+44", label: "🇬🇧 +44 United Kingdom" },
  { value: "+971", label: "🇦🇪 +971 UAE" },
  { value: "+65", label: "🇸🇬 +65 Singapore" },
  { value: "+61", label: "🇦🇺 +61 Australia" },
  { value: "+49", label: "🇩🇪 +49 Germany" },
  { value: "+81", label: "🇯🇵 +81 Japan" },
] as const

export const QUALIFICATIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Other",
] as const

export const EXPERIENCE_LEVELS = [
  "No Experience",
  "0–1 Years",
  "1–3 Years",
  "3–5 Years",
  "5+ Years",
] as const

export const PROFESSIONS = [
  "Student",
  "Software Developer",
  "Data Professional",
  "Business Owner / Founder",
  "Marketing / Sales",
  "Operations / Manager",
  "Freelancer",
  "Other",
] as const

/** Options for NocoDB `user_role` on masterclass registrations. */
export const USER_ROLES = PROFESSIONS

export const MASTERCLASS_SLOTS = [
  { id: "2pm-4pm", label: "2:00 PM – 4:00 PM" },
  { id: "5pm-7pm", label: "5:00 PM – 7:00 PM" },
] as const

/** Number of days (starting tomorrow) available for masterclass booking. */
export const MASTERCLASS_BOOKING_WINDOW_DAYS = 14

export const MODAL_BENEFITS = [
  "Industry Projects",
  "Certification",
  "Expert Mentorship",
  "Live Sessions",
] as const

export const BROCHURE_DOWNLOAD_PATH = "/downloads/neuralvarsity-brochure.pdf"

export type NocoDbEnrollRecord = {
  full_name: string
  email: string
  country_code: string
  phone: string
  city: string
  qualification: string
  profession: string
  "Experience-Level": string
  termsAccepted: boolean
}

function getNocoDbConfig() {
  const baseUrl = process.env.NOCODB_BASE_URL?.replace(/\/$/, "")
  const token = process.env.NOCODB_API_TOKEN
  const tableId = process.env.NOCODB_TABLE_ID

  if (!baseUrl || !token || !tableId) {
    throw new Error("Missing NocoDB environment variables.")
  }

  return { baseUrl, token, tableId }
}

export async function insertNocoDbRecord(record: NocoDbEnrollRecord) {
  const { baseUrl, token, tableId } = getNocoDbConfig()

  const response = await fetch(`${baseUrl}/api/v2/tables/${tableId}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xc-token": token,
    },
    body: JSON.stringify(record),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`NocoDB insert failed (${response.status}): ${details}`)
  }

  return response.json()
}

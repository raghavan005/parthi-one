// Helper to query Neon via its REST API
// Set NEON_API_URL and NEON_API_KEY in your environment variables

const NEON_API_URL = process.env.NEON_API_URL!; // e.g. https://ep-xxx.apirest.c-7.us-east-1.aws.neon.tech/neondb/rest/v1
const NEON_API_KEY = process.env.NEON_API_KEY!;  // your Neon API key

export async function neonQuery(query: string, params: unknown[] = []) {
  const res = await fetch(`${NEON_API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${NEON_API_KEY}`,
    },
    body: JSON.stringify({ query, params }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neon REST error ${res.status}: ${text}`);
  }

  const data = await res.json();
  // Neon REST API returns { rows: [...] }
  return data.rows as Record<string, unknown>[];
}

export async function ensureTable() {
  await neonQuery(`
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      email TEXT NOT NULL,
      material TEXT NOT NULL,
      specs_width TEXT NOT NULL,
      specs_height TEXT NOT NULL,
      handle_type TEXT NOT NULL,
      quantity TEXT NOT NULL,
      printed_logo TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

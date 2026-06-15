// Neon Data API client using PostgREST-compatible REST calls via fetch
// NEON_API_URL  — e.g. https://ep-xxx.apirest.c-7.us-east-1.aws.neon.tech/neondb/rest/v1
// NEON_API_KEY  — your Neon API key (from neon.tech → Account Settings → API Keys)

const BASE = process.env.NEON_API_URL!;
const KEY  = process.env.NEON_API_KEY!;

function headers(extra: Record<string, string> = {}) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${KEY}`,
    ...extra,
  };
}

// SELECT all rows from a table, ordered by created_at DESC
export async function selectAll(table: string) {
  const res = await fetch(`${BASE}/${table}?order=created_at.desc`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`GET ${table} failed: ${await res.text()}`);
  return res.json();
}

// INSERT a row and return the created row (with id)
export async function insertRow(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${BASE}/${table}`, {
    method: "POST",
    headers: headers({ "Prefer": "return=representation" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${table} failed: ${await res.text()}`);
  const rows = await res.json();
  return rows[0];
}

// UPDATE a row by id
export async function updateRow(table: string, id: number, data: Record<string, unknown>) {
  const res = await fetch(`${BASE}/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: headers({ "Prefer": "return=representation" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PATCH ${table} id=${id} failed: ${await res.text()}`);
  const rows = await res.json();
  return rows;
}

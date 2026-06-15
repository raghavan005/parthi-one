import { createClient } from "@libsql/client";

// TURSO_DATABASE_URL — e.g. libsql://your-db-name-username.turso.io
// TURSO_AUTH_TOKEN  — from: turso db tokens create your-db-name

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Ensure the quotes table exists
export async function setupSchema() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// SELECT all quotes ordered by newest first
export async function selectAll() {
  await setupSchema();
  const result = await client.execute(
    "SELECT * FROM quotes ORDER BY created_at DESC"
  );
  return result.rows;
}

// INSERT a new quote row, returns the new row id
export async function insertQuote(data: {
  client_name: string;
  business_name: string;
  mobile_number: string;
  email: string;
  material: string;
  specs_width: string;
  specs_height: string;
  handle_type: string;
  quantity: string;
  printed_logo: string;
}) {
  await setupSchema();
  const result = await client.execute({
    sql: `INSERT INTO quotes
      (client_name, business_name, mobile_number, email, material, specs_width, specs_height, handle_type, quantity, printed_logo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.client_name,
      data.business_name,
      data.mobile_number,
      data.email,
      data.material,
      data.specs_width,
      data.specs_height,
      data.handle_type,
      data.quantity,
      data.printed_logo,
    ],
  });
  return { id: result.lastInsertRowid };
}

// UPDATE quote status by id
export async function updateStatus(id: number, status: string) {
  await setupSchema();
  const result = await client.execute({
    sql: "UPDATE quotes SET status = ? WHERE id = ?",
    args: [status, id],
  });
  return result.rowsAffected;
}

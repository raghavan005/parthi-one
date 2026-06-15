import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@libsql/client";

function getClient() {
  const rawUrl = process.env.TURSO_DATABASE_URL!;
  const url = rawUrl.replace(/^libsql:\/\//, "https://");
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN! });
}

async function setupSchema(client: ReturnType<typeof getClient>) {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = getClient();

  // GET /api/quotes — fetch all quotes
  if (req.method === "GET") {
    try {
      await setupSchema(client);
      const result = await client.execute("SELECT * FROM quotes ORDER BY created_at DESC");
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("GET /api/quotes error:", error);
      return res.status(500).json({ error: String(error) });
    }
  }

  // POST /api/quotes — create a new quote
  if (req.method === "POST") {
    try {
      await setupSchema(client);
      const {
        client_name,
        business_name,
        mobile_number,
        email,
        material,
        specs_width,
        specs_height,
        handle_type,
        quantity,
        printed_logo,
      } = req.body;

      const result = await client.execute({
        sql: `INSERT INTO quotes
          (client_name, business_name, mobile_number, email, material, specs_width, specs_height, handle_type, quantity, printed_logo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          client_name,
          business_name || "N/A",
          mobile_number,
          email || "N/A",
          material,
          specs_width,
          specs_height,
          handle_type,
          quantity,
          printed_logo,
        ],
      });

      return res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (error) {
      console.error("POST /api/quotes error:", error);
      return res.status(500).json({ error: String(error) });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

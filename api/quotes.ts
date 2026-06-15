import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neonQuery, ensureTable } from "./lib/neon";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureTable();

  // GET /api/quotes — fetch all quotes
  if (req.method === "GET") {
    try {
      const quotes = await neonQuery(
        "SELECT * FROM quotes ORDER BY created_at DESC"
      );
      return res.status(200).json(quotes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch quotes" });
    }
  }

  // POST /api/quotes — create a new quote
  if (req.method === "POST") {
    try {
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

      const result = await neonQuery(
        `INSERT INTO quotes (
          client_name, business_name, mobile_number, email,
          material, specs_width, specs_height, handle_type, quantity, printed_logo
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
        [
          client_name,
          business_name ?? "N/A",
          mobile_number,
          email ?? "N/A",
          material,
          specs_width,
          specs_height,
          handle_type,
          quantity,
          printed_logo,
        ]
      );

      return res.status(201).json({ success: true, id: result[0].id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create quote" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

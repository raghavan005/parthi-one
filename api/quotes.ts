import type { VercelRequest, VercelResponse } from "@vercel/node";
import { selectAll, insertRow } from "./lib/neon";

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // GET /api/quotes — fetch all quotes
  if (req.method === "GET") {
    try {
      const quotes = await selectAll("quotes");
      return res.status(200).json(quotes);
    } catch (error) {
      console.error("GET /api/quotes error:", error);
      return res.status(500).json({ error: String(error) });
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

      const row = await insertRow("quotes", {
        client_name,
        business_name: business_name || "N/A",
        mobile_number,
        email: email || "N/A",
        material,
        specs_width,
        specs_height,
        handle_type,
        quantity,
        printed_logo,
        status: "New",
      });

      return res.status(201).json({ success: true, id: row.id });
    } catch (error) {
      console.error("POST /api/quotes error:", error);
      return res.status(500).json({ error: String(error) });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
